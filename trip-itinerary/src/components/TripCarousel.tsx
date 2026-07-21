import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import TripPreview from './TripPreview';
import { type Trip } from '../types/Trip';

interface TripCarouselProps {
    trips: Trip[]
}

export default function TripCarousel({ trips }: TripCarouselProps) {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
        >
            {trips.map((trip) => (
                <SwiperSlide key={trip.id}>
                    <TripPreview/>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}