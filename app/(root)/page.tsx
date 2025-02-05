import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button"
import { getAllEvents } from "@/lib/actions/event.actions";


import Image from "next/image";
import Link from "next/link";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export default async function Home({ searchParams }: any) {


  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';


  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 3
  })


  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="lg:text-[45px] text-[40px] font-bold">Host, Connect, Celebrate: Your Events, Our Platform!</h1>
            <p className="p-regular-20 md:p-regular-24">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community</p>

            <Button size='lg' asChild className="button w-full sm:w-fit">
              <Link href='#events'>
                Explore Now
              </Link>
            </Button>

          </div>

          <Image src='/assets/images/hero.png' alt='hero' width={800} height={800} className="max-h-[57vh] object-contain object-center 2xl:max-h-[50vh]" />
        </div>
      </section>

      <section id="events" className="wrapper my-8 flex-col md:gap-12 gap-8" >

        <h2 className="font-bold text-[36px]">Trusted by <br /> Thousands of Events</h2>

        <div className="flex w-full flex-col mt-4 gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <div className="flex w-full flex-col gap-5 md:flex-row">


        </div>

        <Collection data={events?.data} emptyTitle='No Events Found' emptyStateSubtext='Come back later' collectionType='All_Events' limit={6} page={page} totalPages={events?.totalPages} />
      </section>
    </>
  );
}
