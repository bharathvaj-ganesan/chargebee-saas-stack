import SettingsSidebar from "./SettingsSidebar";

export default function SettingsLayout({ children }: { children: any }) {
  return (
    <>
      <div className="text-whit">
        <div>
          <div>
            <div className="bg-light-blue-700 relative overflow-hidden pb-32">
              <header className="relative py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold">Settings</h1>
                </div>
              </header>
            </div>

            <main className="relative -mt-32">
              <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                <div className="overflow-hidden rounded-lg bg-zinc-900 shadow">
                  <div className="flex">
                    <aside className="basis-1/4 py-6">
                      <SettingsSidebar />
                    </aside>
                    <section className="w-full p-6">{children}</section>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
