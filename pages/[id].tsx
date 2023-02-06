import { supabase } from "../utils/supabase";
import { Lesson } from "../types/lesson";
import { useState, useEffect } from "react";
import ReactPlayer from 'react-player';

const LessonDetails = ({ lesson }: { lesson: Lesson }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    console.log(videoUrl);
    const getPremiumContent = async () => {
        const { data } = await supabase
          .from("premium_content")
          .select("video_url")
          .eq("id", lesson.id)
          .single();
    
        setVideoUrl(data?.video_url);
      };
    
      useEffect(() => {
        getPremiumContent();
        console.log(videoUrl)
      }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="flex space-y-2 flex-col items-center justify-center w-full max-w-md p-4 my-4 bg-indigo-500 rounded-md shadow-md custom-shape">
                <h1 className="text-white text-2xl font-bold">
                    {lesson.title}
                </h1>
                <p className="text-white">{lesson.description}</p>
                <p className="text-white">{lesson.fun ? "Fun" : "Not fun"}</p>
            </div>
            <div className="w-4/6">
            {!!videoUrl && (
                <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    controls={true}
                />
            )}
            </div>
        </div>
    );
};

export const getStaticPaths = async () => {
    const { data: lessons } = await supabase.from("lesson").select("id");

    const paths = lessons?.map(({ id }) => ({
        params: { id: id.toString() },
    }));
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async ({
    params: { id },
}: {
    params: { id: number };
}) => {
    const { data: lesson } = await supabase
        .from("lesson")
        .select("*")
        .eq("id", id)
        .single();

    return {
        props: {
            lesson,
        },
    };
};

export default LessonDetails;
