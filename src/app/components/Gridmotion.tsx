import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Music } from 'lucide-react';

interface GridMotionProps {
    images?: string[];
    altText?: string;
    gridRows?: number;
    gridCols?: number;
}

const GridMotion: React.FC<GridMotionProps> = ({
    images = [
        '/band/band3.jpeg',
        '/band/band5.jpg',
        '/band/band6.jpeg',
        '/band/band4.jpg',
        '/band/band3.jpeg',
        '/band/band3.jpeg',
        '/band/band4.jpg',
        '/band/band5.jpg',
        '/band/band6.jpeg',
        '/band/band6.jpeg',
        '/band/band3.jpeg',
        '/band/band3.jpeg',
        '/band/band3.jpeg',
        '/band/band3.jpeg',
        '/band/band4.jpg',
        '/band/band5.jpg',
        '/band/band6.jpeg',
        '/band/band6.jpeg',
    ],
    altText = 'Grid Image',
    gridRows = 5,
    gridCols = 7,
}) => {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const mouseXRef = useRef<number>(window.innerWidth / 2);

    const totalItems = gridRows * gridCols;

    const getImageArray = () => {
        if (images.length === 0) return Array(totalItems).fill('/api/placeholder/400/300');

        const fullImageArray = [];
        for (let i = 0; i < totalItems; i++) {
            fullImageArray.push(images[i % images.length]);
        }
        return fullImageArray;
    };

    const imageArray = getImageArray();

    useEffect(() => {
        if (window.innerWidth < 768) return; // Disable animation on mobile

        gsap.ticker.lagSmoothing(0);

        const handleMouseMove = (e: MouseEvent) => {
            mouseXRef.current = e.clientX;
        };

        const updateMotion = () => {
            const maxMoveAmount = window.innerWidth < 1024 ? 150 : 300;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rowRefs.current.forEach((row, index) => {
                if (row) {
                    const direction = index % 2 === 0 ? 1 : -1;
                    const moveAmount =
                        ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) *
                        direction;

                    gsap.to(row, {
                        x: moveAmount,
                        duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                        ease: 'power3.out',
                        overwrite: 'auto',
                    });
                }
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            removeAnimationLoop();
        };
    }, []);

    return (
        <div ref={gridRef} className="h-screen w-full overflow-hidden mb-5">
            <section className="w-full min-h-screen overflow-hidden relative flex items-center justify-center bg-[#0a0a0a]">
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Info Box */}
                <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 z-50 md:inset-x-auto md:w-full md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
                    <div className="backdrop-blur-xl bg-[#0a0a0a]/90 p-4 md:p-8 rounded-none border border-red-600/20 shadow-2xl relative">
                        {/* Corner Frames - Only visible on tablet and up */}
                        <div className="hidden md:block">
                            {/* Corner frame components remain the same */}
                            {/* Top Left */}
                            <div className="absolute left-0 top-0 w-8 h-8">
                                <div className="absolute left-0 top-0 w-full h-px bg-red-600/50" />
                                <div className="absolute left-0 top-0 w-px h-full bg-red-600/50" />
                            </div>
                            {/* Other corners... */}
                        </div>

                        {/* Band Name and Title */}
                        <div className="text-center mb-4 md:mb-8">
                            {/* <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-2 font-['Chakra_Petch']">
                                Alttaranad
                            </h1> */}
                            <div className="mx-auto w-64 h-64 rounded-lg overflow-hidden">
                                <Image src="/band/bandlogo.png" alt="Band Logo" width={256} height={256} className="object-contain" />
                            </div>
                        </div>

                        {/* Band Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center space-x-3 text-gray-300 text-sm md:text-base">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                                    <span>February 15, 2025</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300 text-sm md:text-base">
                                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                                    <span>6:30 PM</span>
                                </div>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center space-x-3 text-gray-300 text-sm md:text-base">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                                    <span>Main Stage, MBCCET</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300 text-sm md:text-base">
                                    <Music className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                                    <span>Indie Rock</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-center mb-4 md:mb-8 text-sm md:text-base leading-relaxed">
                            Experience the mesmerizing fusion of alternative rock and electronic music as Ethereal Dreams takes the stage.
                            Known for their immersive performances and genre-bending sound, they promise an unforgettable night of music and magic.
                        </p>

                        {/* CTA Button */}

                    </div>
                </div>

                {/* GridMotion container */}
                <div
                    className="grid gap-2 md:gap-4 relative w-[200vw] md:w-[150vw] h-[150vh] origin-center rotate-[-15deg] z-[2]"
                    style={{
                        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                    }}
                >
                    {[...Array(gridRows)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid gap-2 md:gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                                willChange: 'transform, filter'
                            }}
                            ref={(el) => { rowRefs.current[rowIndex] = el; }}
                        >
                            {[...Array(gridCols)].map((_, itemIndex) => {
                                const imageIndex = rowIndex * gridCols + itemIndex;
                                const imagePath = imageArray[imageIndex];

                                return (
                                    <div key={itemIndex} className="relative aspect-video">
                                        <div className="absolute inset-0 rounded-none overflow-hidden bg-gray-900 transition-transform duration-300 md:hover:scale-105">
                                            <Image
                                                src={imagePath}
                                                alt={`${altText} ${imageIndex + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-500 md:group-hover:scale-110 opacity-60"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black opacity-0 md:group-hover:opacity-30 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GridMotion;