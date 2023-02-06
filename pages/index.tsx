import { supabase } from "../utils/supabase";
import Link from "next/link";
import { Lesson } from "../types/lesson";
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { useUserProfile } from "../hooks/use-profile";
import { useEffect } from "react";

interface HomeProps {
    lessons: Lesson[];
}

export default function Home({ lessons }: HomeProps) {
    const session = useSession();
    console.log(session?.access_token)
    console.log(lessons)
    const { fetching: loadingProfile, error, profile } = useUserProfile();

    useEffect(() => {
        if (profile) {
            console.log(profile);
        }
      }, [ profile ]);

      return (
		<div className="w-full max-w-3xl mx-auto my-16 px-2">
			{lessons && lessons.map((lesson: Lesson) => (
				<Link key={lesson.id} href={`/${lesson.id}`} className="p-8 mb-4 rounded shadow text-xl flex">{lesson.title}</Link>
			))}
		</div>
	);
}

export const getStaticProps = async () => {
    const { data: lessons } = await supabase.from("lesson").select("*");
    return {
        props: {
            lessons,
        },
    };
};
