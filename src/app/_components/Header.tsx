import DecryptedText from "./ui/decryptedText";
export const Header = ({ id, heading }: { id: string; heading: string }) => {
  return (
    <>
      <div
        id={id}
        className="w-full bg-gray-950 py-16 relative overflow-hidden border-b border-red-900/30"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#aa000015,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,#ff000008,transparent)]" />

        {/* Decorative Lines */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />
        <div className="absolute right-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />

        {/* Corner Accents */}
        <div className="absolute left-2 top-2 w-8 h-8 border-l-2 border-t-2 border-red-700" />
        <div className="absolute right-2 top-2 w-8 h-8 border-r-2 border-t-2 border-red-700" />
        <div className="absolute left-2 bottom-2 w-8 h-8 border-l-2 border-b-2 border-red-700" />
        <div className="absolute right-2 bottom-2 w-8 h-8 border-r-2 border-b-2 border-red-700" />

        {/* Main Content Container */}
        <div className="relative z-10 w-full text-center">
          {/* Small top text */}
          <p className="text-red-600/50 text-center text-sm mb-2 font-['Chakra_Petch'] tracking-[0.3em] uppercase">
            HASH 2025
          </p>

          <DecryptedText
            text={heading}
            speed={50}
            revealDirection="center"
            useOriginalCharsOnly={false}
            animateOn="view"
            sequential={true}
            maxIterations={20}
            characters="ABCD1234!?"
            className="revealed w-full font-['Chakra_Petch'] text-2xl md:text-3xl lg:text-5xl font-bold text-red-600 text-center tracking-wider [text-shadow:0_0_10px_rgba(220,0,0,0.3)]"
            parentClassName="all-letters"
            encryptedClassName="encrypted"
          />

          {/* Decorative line below text */}
          <div className="mt-4 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>

        {/* Diagonal corner lines */}
        <div className="absolute left-0 top-0 w-16 h-16">
          <div className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-transparent transform origin-left rotate-45" />
        </div>
        <div className="absolute right-0 top-0 w-16 h-16">
          <div className="absolute right-0 top-0 w-full h-0.5 bg-gradient-to-l from-red-600 to-transparent transform origin-right -rotate-45" />
        </div>

        {/* Animated pulse effect */}
        <div className="absolute inset-0 animate-pulse" />
      </div>
    </>
  );
};

export default Header;
