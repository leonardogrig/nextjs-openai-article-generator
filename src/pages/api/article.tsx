import { Configuration, OpenAIApi } from "openai";
import { getSubtitles } from "youtube-captions-scraper";
import { Request, Response } from "express";

function formatString(str: string) {
  str = str.replace(/^<br\s*\/?>/i, "");
  str = str.replace(/<(?!br\s*\/?)[^>]+>/gi, "");
  let paragraphs = str.split(/<br\s*\/?>/gi);
  for (let i = 0; i < paragraphs.length; i++) {
    let phrases = paragraphs[i].split(/[.?!]+/g);
    let numPhrases = phrases.filter(Boolean).length;
    if (numPhrases > 3) {
      paragraphs[i] = "<br/>" + paragraphs[i] + "<br/>";
    }
  }
  str = paragraphs.join("<br/>");
  str = str.replace(/<(?!br\s*\/?)[^>]+>/gi, "");
  str = str.replace(/(<br\s*\/?>){3,}/gi, "<br/><br/>");
  str = str.replace(/(<br\s*\/?>){2,}/gi, "<br/><br/>");
  str = str.trim();

  return str;
}

const generateArticle = async (
  prompt: string,
  dynamicMaxLength: number
): Promise<string> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: dynamicMaxLength,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const textData = response.data.choices[0]["text"]!.replace(/\n/g, "<br/>");

  return textData;
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed!!" });
    return;
  }

  if (req.method === "POST") {
    const chat = req.body.chat;
    if (chat) {
      const subtitles = await getSubtitles({
        videoID: chat,
        lang: "en",
      });

      const traditionalData = subtitles.map(
        (item: { start: any; text: any }, index: any) => {
          return `${item.text}`;
        }
      );

      // get chunks of the traditionalData array
      const chunks = traditionalData.reduce(
        (resultArray: any[][], item: any, index: number) => {
          const chunkIndex = Math.floor(index / 20);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        },
        []
      );

      let article = "";
      let resumeArticle = "";
      // loop through chunks
      let counter = 0;
      let forCounter = 0;

      let previousChunk = [];
      for (const chunk of chunks) {
        const chunkString = chunk.join(" ");

        let prompt = `<This is a subtitle piece from a youtube video:>\n
                and when you say that the person has to be perfect, she won't succeed, it's not because she knows she's a beginner if you fall while you're learning to walk before running you'll fall before running you're a baby you've never walked you have to crawl before and after crawling you take the first steps a little hesitant a thousand touches then you start to be more firm and then then I have to start to have control over what you're doing and run it's quantity that leads to quality everything else is people with reducing customs saying like you don't need to do so much you don't need to do this you need to do that come here buy the \n\n
               
                <Rewritten caption, in first person, in summary format:>\n
                When talking about perfection, it's important to remember that, as a beginner, it's impossible to achieve. I encourage people to allow themselves to make mistakes while they are learning, just like a baby who needs to crawl before he can walk. In the learning process, it is normal to stumble a few times before becoming more steady and having control over what you are doing. I believe that quantity of practice leads to quality, and there is no magic formula or shortcut to success. Some people try to sell reductionist solutions by saying that you don't need to do as much or that you just need to follow a specific formula. But I believe it's important to persevere and follow the path that works best for you.\n\n
               
                <This is a subtitle piece from a youtube video>:\n
                my course that I teach you I don't have anxiety there please please be honest with the courses you take I'm honest I don't romanticize Paulo then they got up like that at one go he already does five surgeries a day is a surgeon who doesn't have time to post because if not his function is perfect the surgeon who does five surgeries a day still seems like good money to me if he wants more surgeries and more patients he should hire a strategist he should hire a professional to help him in the preparation and production of these The contents are simple Paulo says but I have another profession and I don't have money how do I do it Accept the imbalance This romantic view that I won't have time for myself if\n\n
               
                <Rewritten caption, in first person, in summary format:>\n
                In my course, I encourage my students to be honest and not be anxious about results. I'm honest and I don't romanticize success. Recently, a surgeon was cited as an example, as he performs five surgeries a day and does not have time to post content. Although he earns well, if he wants more patients, he could hire a professional to help with content production. If someone questions me saying they have another profession and don't have money, I advise you to accept the imbalance and not be deceived by the romantic view that you won't have time for yourself.\n\n
               
                <This is a subtitle piece from a youtube video:>\n
                ${chunkString}\n\n
                
                <Rewritten caption, in first person, in summary format:>\n
                `;

        if (forCounter == 1) {
          const firstChunkString = chunks[0].join("\n");

          prompt = `<This is a subtitle piece from a youtube video:>\n
                    my course that I teach you I don't have anxiety there please please be honest with the courses you take I'm honest I don't romanticize Paulo then they got up like that at one go he already does five surgeries a day is a surgeon who doesn't have time to post because if not his function is perfect the surgeon who does five surgeries a day still seems like good money to me if he wants more surgeries and more patients he should hire a strategist he should hire a professional to help him in the preparation and production of these The contents are simple Paulo says but I have another profession and I don't have money how do I do it Accept the imbalance This romantic view that I won't have time for myself if\n\n
                    
                    <Rewritten caption, in first person, in summary format:>\n
                    In my course, I encourage my students to be honest and not be anxious about results. I'm honest and I don't romanticize success. Recently, a surgeon was cited as an example, as he performs five surgeries a day and does not have time to post content. Although he earns well, if he wants more patients, he could hire a professional to help with content production. If someone questions me saying they have another profession and don't have money, I advise you to accept the imbalance and not be deceived by the romantic view that you won't have time for yourself.\n\n
                    
                    <This is a subtitle piece from a youtube video:>\n
                    ${firstChunkString}\n\n
                   
                    <Rewritten caption, in first person, in summary format:>\n
                    ${previousChunk[previousChunk.length - 1]}\n\n
                   
                    <This is a subtitle piece from a youtube video:>\n
                    ${chunkString}\n\n
                    
                    <Rewritten caption, in first person, in summary format:>\n
                    `;
        } else if (forCounter >= 2) {
          const firstChunkString = chunks[counter - 2].join("\n");
          const secondChunkString = chunks[counter - 1].join("\n");

          prompt = `<This is a subtitle piece from a youtube video:>\n
                    ${firstChunkString}\n\n
                    
                    <Rewritten caption, in first person, in summary format:>\n
                    ${previousChunk[previousChunk.length - 2]}\n\n
                    
                    <This is a subtitle piece from a youtube video:>\n
                    ${secondChunkString}\n\n
                    
                    <Rewritten caption, in first person, in summary format:>\n
                    ${previousChunk[previousChunk.length - 1]}\n\n
                    
                    <This is a subtitle piece from a youtube video:>\n
                    ${chunkString}\n\n
                    
                    <Rewritten caption, in first person, in summary format:>\n
                    `;
        }

        const dynamicMaxLength = Math.floor(4000 - prompt.length / 2.5);
        // generate article
        const pieceOfContent = await generateArticle(prompt, dynamicMaxLength);

        previousChunk.push(pieceOfContent);

        article += pieceOfContent;
        counter++;

        // on the third iteration
        if (counter == 3) {
          const prompt = `<This is gibberish text:>\n
                    ${article}\n\n
                    <This is an excerpt from an article rewritten with title and subtitle (no author should be named):>\n
                    `;

          const dynamicMaxLength = Math.floor(4000 - prompt.length / 2.5);

          const resumeOfArticle = await generateArticle(
            prompt,
            dynamicMaxLength
          );
          resumeArticle += "<br/><br/>";
          resumeArticle += resumeOfArticle;
          article = "";
          counter = 0;
        }

        // if on last iteration
        if (
          chunk === chunks[chunks.length - 1] ||
          chunk === chunks[chunks.length - 2] ||
          chunk === chunks[chunks.length - 3]
        ) {
          if (counter == 0 || counter == 1 || counter == 2) {
            resumeArticle += article;
          }
        }
        forCounter++;
      }

      article = resumeArticle;

      if (article.length < 2500) {
        const prompt = `<This is gibberish text:>\n
                ${article}\n
                
                <This is the same text, rewritten in article format:>\n
                `;

        const dynamicMaxLength = Math.floor(4000 - prompt.length / 2.5);

        const resumeOfArticle = await generateArticle(prompt, dynamicMaxLength);

        article = resumeOfArticle;
      }

      if (article) {
        res.json(formatString(article));
      } else {
        res.status(500).send("Oops, Something went wrong!!");
      }
    } else {
      res.status(404).send("Please, write your chat!!");
    }
  }
}
