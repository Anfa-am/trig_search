import OpenAI from "openai";

export async function RoleDescription({ jobTitle }: { jobTitle: string }) {
  const apiKey = process.env.NEXT_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Pexels API key is missing');
  }

  const client = new OpenAI({
    apiKey: apiKey
  });

  try{
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `In plain text write a breif description for the following job title: ${jobTitle}. If you can't come up with a description, just write "No description availible." and do not include any formatting like * or -` ,
        },
      ],
    });

    const description = completion.choices[0]?.message.content

    return (
      <div className="mt-10">
        {description}
      </div>
    );
  } catch (error) {
    console.log(error)
    return(<div>No description availible.</div>);
  }
}
