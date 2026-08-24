import Image from "next/image";

const renderTeamHeaderLogo = (
  teamName: string,
  shortName: string | null,
  logoUrl: string | null,
) => {
  const sName = shortName || teamName.slice(0, 3);
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={teamName}
        width={64}
        height={64}
        unoptimized
        className="h-10 w-10 min-[500px]:h-12 min-[500px]:w-12 md:h-14 md:w-14 rounded-full object-cover border border-slate-100 shadow-xs"
      />
    );
  }
  return (
    <div className="h-10 w-10 min-[500px]:h-12 min-[500px]:w-12 md:h-14 md:w-14 rounded-full bg-slate-100 text-slate-700 text-xs min-[500px]:text-sm md:text-lg font-black flex items-center justify-center border border-slate-200 shadow-xs">
      {sName.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default renderTeamHeaderLogo;
