import { json, type ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import AudioButton from "~/components/AudioButton";
import { DICTIONARY_API } from "~/utils/constants";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const definitionRequest = await fetch(
    `${DICTIONARY_API}/${body.get("word")}`
  );
  const definitionResponse = await definitionRequest.json();

  const formattedDefinition = definitionResponse.reduce(
    (acc: any, currentDef: any) => {
      acc.word = currentDef.word;
      acc.source = currentDef.sourceUrls[0];
      acc.phonetics = currentDef.phonetics.find(
        (phonetic: { audio: string }) => phonetic.audio !== ""
      );
      acc.meanings = currentDef.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        synonyms: meaning.synonyms,
        definitions: meaning.definitions.map((definition) => ({
          example: definition?.example ?? "",
          definition: definition.definition,
        })),
      }));

      return acc;
    },
    {}
  );

  return json(formattedDefinition);
}

export default function Index() {
  const wordDefinition = useActionData<typeof action>();
  console.log(wordDefinition);
  return (
    <>
      <header>
        <nav>
          <img src="/logo.svg" alt="logo" />
        </nav>
        <Form method="post">
          <input type="text" name="word" placeholder="Search for any word..." />
        </Form>
      </header>
      <main>
        {wordDefinition && (
          <>
            <h1>{wordDefinition.word}</h1>
            <p>{wordDefinition.phonetics.text}</p>
            <AudioButton audioSrc={wordDefinition.phonetics.audio} />
            <a href={wordDefinition.source} target="_blank" rel="noreferrer">
              {wordDefinition.source}
            </a>
          </>
        )}
      </main>
    </>
  );
}
