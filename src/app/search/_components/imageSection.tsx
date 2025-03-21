import Image from 'next/image';

type ImageDetails = {
  alt: string;
  avg_color: string;
  height: number;
  id: number;
  liked: boolean;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
  };
  url: string;
  width: number;
};


export async function ImageSection({ imageQuery }: { imageQuery: string }) {
  const URL = `https://api.pexels.com/v1/search?query=${imageQuery}&per_page=4&page=1`;

  const apiKey = process.env.NEXT_PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error('Pexels API key is missing');
  }

  const res = await fetch(URL, {
    headers: {
      'Authorization': apiKey
    },
  });

  const {photos} = await res.json() as { photos: ImageDetails[] };

  if(photos.length === 0) { return (<div> </div>); }

  return (<div className="grid grid-cols-2 gap-1 rounded-[25px] overflow-hidden">
    {photos.map((photo, index) => (
      <Image
        className="object-cover h-full w-full max-h-[200px]"
        key={index + photo.id}
        src={photo?.src.medium ?? ''}
        alt={photo?.alt ?? ''}
        width={photo?.width}
        height={photo?.height}
      />
    ))}

  </div>);
}
