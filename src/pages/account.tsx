import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <section className="bg-black">
      <div className="align-center mx-auto flex max-w-6xl flex-col items-center py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-xl">
          <div>
            Hello <span className="text-primary">{session?.user?.name}</span> 👋
          </div>
        </div>
      </div>
    </section>
  );
}
