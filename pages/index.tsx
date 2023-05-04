import type { NextPage } from 'next';
import { FormEvent, useState } from 'react';

const Home: NextPage = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let form = {
      message,
    };

    const data: any = JSON.parse(message)
      .data.serpResponse.results.edges?.map(
        ({ relay_rendering_strategy }: any) => relay_rendering_strategy
      )
      ?.map(({ view_model }: any) => view_model)
      ?.map(({ profile }: any) => profile);
    console.log('data', data);

    const rawResponse = await Promise.all(
      data?.map((item: any) =>
        fetch('/api/submit', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            name: item.name,
            url: item.url,
            picture: item.profile_picture.uri,
          }),
        })
      )
    );
    console.log('rawResponse', rawResponse);

    // print to screen
    // alert(content.data.tableRange)

    // Reset the form fields
    setMessage('');
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto py-16">
        <form className="py-4 space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="message"
              className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-64 sm:text-md border-gray-300 rounded-md"
              placeholder="Your Message"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="flex items-center justify-center text-sm w-64 rounded-md shadow py-3 px-2 text-white bg-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Home;
