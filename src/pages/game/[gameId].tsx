import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticProps,
} from "next";
import Image from "next/image";
import Link from "next/link";
import Accordion from "../../components/accordion";
import { GameType, AccordionDataProps } from "../../types";

export const getStaticProps: GetStaticProps<{}> = async (context) => {
  const { params } = context;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CORS_WORKER}/?${process.env.NEXT_PUBLIC_APP_ENDPOINT}/${params?.gameId}?key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const data = await res.json();
  return {
    props: { data },
  };
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default function Page({ data }: { data: GameType }) {
  const accordionData: AccordionDataProps[] = [
    { id: 0, header: "Description", content: data.description_raw },
    {
      id: 2,
      header: "Genre",
      content: (
        <>
          {data.genres.map((el) => (
            <p key={el.id}>{el.name}</p>
          ))}
        </>
      ),
    },
    {
      id: 1,
      header: "Image",
      content: (
        <Image
          src={
            data.background_image ??
            "https://placehold.co/600x400/jpg?text=No+image"
          }
          alt="placeholder"
          width="640"
          height="360"
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Link className="text-blue-600 mb-4 block" href="/">
        Regresar
      </Link>
      <Accordion title={data.name} data={accordionData} />
    </div>
  );
}
