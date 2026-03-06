import { AUTH_BG, AUTH_LOGO, AUTH_PLANE_IMG } from "@/lib/images";
import ImageCustom from "@/components/common/Image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full h-screen flex bg-mainBG overflow-hidden">
      <div className="hidden md:flex flex-1 h-screen min-w-0 shrink-0 p-5 overflow-hidden">
        <div className="relative w-full h-full min-w-0 min-h-0 rounded-[22px] overflow-hidden">
          <ImageCustom
            src={AUTH_BG}
            alt="AUTH_BG"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ImageCustom
              src={AUTH_LOGO}
              alt="AUTH_LOGO"
              className="max-w-[80%] max-h-[45%] w-auto h-auto object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] min-w-[220px] max-w-[90%] lg:w-[85%] lg:max-w-[420px] lg:min-w-[200px] pb-6 pointer-events-none flex justify-center items-end">
            <ImageCustom
              src={AUTH_PLANE_IMG}
              alt="AUTH_PLANE_IMG"
              className="w-full h-auto object-contain object-bottom max-h-[55%]"
            />
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
