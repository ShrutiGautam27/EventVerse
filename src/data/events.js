// Event data copied verbatim from the original script.js
export const events = [

    /* =========================
       MUSIC — 2 EVENTS
    ========================= */

    {
        id: 1,
        title: "Neon Nights Festival",
        category: "Music",
        zone: "Chandigarh",
        date: "2026-09-12",
        displayDate: "12 September 2026",
        time: "6:30 PM",
        venue: "City Open Air Arena",
        city: "Chandigarh",
        rating: 4.9,
        price: 499,
        organizer: "EventVerse Live",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
        description: "A high-energy evening of live music, lights and unforgettable festival moments."
    },

    {
        id: 2,
        title: "Indie Beats Live",
        category: "Music",
        zone: "Tricity",
        date: "2026-10-10",
        displayDate: "10 October 2026",
        time: "7:00 PM",
        venue: "Riverside Amphitheatre",
        city: "Tricity",
        rating: 4.6,
        price: 299,
        organizer: "IndieVerse",
        image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=80",
        description: "A live indie music experience featuring emerging artists and local bands."
    },


    /* =========================
       COMEDY — 2 EVENTS
    ========================= */

    {
        id: 3,
        title: "Comedy Under The Stars",
        category: "Comedy",
        zone: "Chandigarh",
        date: "2026-09-16",
        displayDate: "16 September 2026",
        time: "8:00 PM",
        venue: "Sector 17 Plaza",
        city: "Chandigarh",
        rating: 4.7,
        price: 399,
        organizer: "LaughHouse Events",
        image: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1000&q=80",
        description: "A fun stand-up comedy evening featuring talented performers from across the Tricity."
    },

    {
        id: 4,
        title: "Laugh Riot Night",
        category: "Comedy",
        zone: "Panchkula",
        date: "2026-10-14",
        displayDate: "14 October 2026",
        time: "7:30 PM",
        venue: "Town Hall Panchkula",
        city: "Panchkula",
        rating: 4.8,
        price: 349,
        organizer: "Laugh Factory",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80",
        description: "A hilarious evening of stand-up comedy, stories and crowd interaction."
    },


    /* =========================
       SPORTS — 2 EVENTS
    ========================= */

    {
        id: 5,
        title: "Tricity Sports Carnival",
        category: "Sports",
        zone: "Mohali",
        date: "2026-09-20",
        displayDate: "20 September 2026",
        time: "9:00 AM",
        venue: "Mohali Sports Complex",
        city: "Mohali",
        rating: 4.7,
        price: 199,
        organizer: "Tricity Sports Association",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
        description: "A full-day sports celebration featuring athletics, football, basketball and team competitions."
    },

    {
        id: 6,
        title: "Chandigarh Football Cup",
        category: "Sports",
        zone: "Chandigarh",
        date: "2026-10-18",
        displayDate: "18 October 2026",
        time: "4:00 PM",
        venue: "Sector 42 Sports Stadium",
        city: "Chandigarh",
        rating: 4.8,
        price: 249,
        organizer: "Chandigarh Football League",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80",
        description: "An exciting football tournament bringing together teams from across the Tricity."
    },


    /* =========================
       FOOD — 2 EVENTS
    ========================= */

    {
        id: 7,
        title: "Chandigarh Food Festival",
        category: "Food",
        zone: "Chandigarh",
        date: "2026-09-24",
        displayDate: "24 September 2026",
        time: "5:00 PM",
        venue: "Sector 35 Grounds",
        city: "Chandigarh",
        rating: 4.6,
        price: 299,
        organizer: "Taste Tricity",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
        description: "Explore delicious food, local flavours, street food and exciting culinary experiences."
    },

    {
        id: 8,
        title: "Street Food Fiesta",
        category: "Food",
        zone: "Mohali",
        date: "2026-10-22",
        displayDate: "22 October 2026",
        time: "4:30 PM",
        venue: "Phase 8 Food Street",
        city: "Mohali",
        rating: 4.7,
        price: 199,
        organizer: "Foodie Junction",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
        description: "Discover popular street food, local favourites and exciting new flavours."
    },


    /* =========================
       TECHNOLOGY — 2 EVENTS
    ========================= */

    {
        id: 9,
        title: "FutureTech Hackathon",
        category: "Technology",
        zone: "Panchkula",
        date: "2026-09-28",
        displayDate: "28 September 2026",
        time: "9:00 AM",
        venue: "IT Park Panchkula",
        city: "Panchkula",
        rating: 4.9,
        price: 299,
        organizer: "FutureTech Community",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80",
        description: "A technology-focused hackathon for students, developers and innovators."
    },

    {
        id: 10,
        title: "AI & Innovation Summit",
        category: "Technology",
        zone: "Tricity",
        date: "2026-10-26",
        displayDate: "26 October 2026",
        time: "10:00 AM",
        venue: "Chitkara Innovation Campus",
        city: "Tricity",
        rating: 4.9,
        price: 0,
        organizer: "TechVerse",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
        description: "Explore artificial intelligence, emerging technologies and the future of innovation."
    },


    /* =========================
       COLLEGE — 2 EVENTS
    ========================= */

    {
        id: 11,
        title: "Tricity Campus Connect",
        category: "College",
        zone: "Tricity",
        date: "2026-10-02",
        displayDate: "2 October 2026",
        time: "10:00 AM",
        venue: "Panjab University Campus",
        city: "Tricity",
        rating: 4.8,
        price: 0,
        organizer: "Tricity Student Network",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
        description: "Connect with students, clubs and communities from across the Chandigarh Tricity."
    },

    {
        id: 12,
        title: "College Fest Carnival",
        category: "College",
        zone: "Panchkula",
        date: "2026-11-01",
        displayDate: "1 November 2026",
        time: "11:00 AM",
        venue: "Government College Panchkula",
        city: "Panchkula",
        rating: 4.7,
        price: 149,
        organizer: "Campus Carnival",
        image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80",
        description: "A vibrant college celebration featuring competitions, performances and student activities."
    },


    /* =========================
       WORKSHOPS — 2 EVENTS
    ========================= */

    {
        id: 13,
        title: "Creative Design Workshop",
        category: "Workshops",
        zone: "Mohali",
        date: "2026-10-06",
        displayDate: "6 October 2026",
        time: "11:00 AM",
        venue: "Mohali Innovation Hub",
        city: "Mohali",
        rating: 4.7,
        price: 349,
        organizer: "Creative Minds",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
        description: "Learn practical design techniques and creative skills from experienced creators."
    },

    {
        id: 14,
        title: "Public Speaking Masterclass",
        category: "Workshops",
        zone: "Chandigarh",
        date: "2026-11-06",
        displayDate: "6 November 2026",
        time: "2:00 PM",
        venue: "Chandigarh Learning Centre",
        city: "Chandigarh",
        rating: 4.8,
        price: 199,
        organizer: "SkillUp Tricity",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
        description: "Build confidence, communication skills and stage presence through practical activities."
    },


    /* =========================
       GAMING — 2 EVENTS
    ========================= */

    {
        id: 15,
        title: "Tricity Gaming Arena",
        category: "Gaming",
        zone: "Panchkula",
        date: "2026-10-10",
        displayDate: "10 October 2026",
        time: "12:00 PM",
        venue: "Panchkula Indoor Arena",
        city: "Panchkula",
        rating: 4.6,
        price: 599,
        organizer: "GameVerse",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        description: "Compete, play and connect with fellow gamers in an exciting gaming arena."
    },

    {
        id: 16,
        title: "Campus Esports Championship",
        category: "Gaming",
        zone: "Mohali",
        date: "2026-11-12",
        displayDate: "12 November 2026",
        time: "1:00 PM",
        venue: "Mohali Esports Centre",
        city: "Mohali",
        rating: 4.8,
        price: 399,
        organizer: "GameNation",
        image: "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=1000&q=80",
        description: "A competitive esports championship featuring exciting gaming battles and campus teams."
    },
    {
    id: 17,
    title: "Punjab Heritage Utsav",
    category: "Cultural",
    zone: "Panchkula",
    date: "2026-09-18",
    displayDate: "18 September 2026",
    time: "5:30 PM",
    venue: "Heritage Ground",
    city: "Panchkula",
    rating: 4.8,
    price: 249,
    organizer: "Punjab Heritage Society",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80",
    description: "Celebrate Punjabi heritage through folk music, dance, traditional art and cultural performances."
},

{
    id: 18,
    title: "Tricity Folk & Arts Festival",
    category: "Cultural",
    zone: "Tricity",
    date: "2026-10-16",
    displayDate: "16 October 2026",
    time: "6:00 PM",
    venue: "Open Hand Cultural Centre",
    city: "Tricity",
    rating: 4.7,
    price: 199,
    organizer: "Tricity Arts Collective",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80",
    description: "An evening celebrating regional art, folk traditions, performances and creative expression."
},

{
    id: 19,
    title: "Festival of Indian Traditions",
    category: "Cultural",
    zone: "Chandigarh",
    date: "2026-11-20",
    displayDate: "20 November 2026",
    time: "5:00 PM",
    venue: "Sector 17 Cultural Plaza",
    city: "Chandigarh",
    rating: 4.9,
    price: 299,
    organizer: "Indian Culture Forum",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    description: "Experience India's diverse traditions through music, dance, crafts, performances and food."
},
{
    id: 20,
    title: "FutureTech Summit",
    category: "Education",
    zone: "Tricity",
    date: "2026-10-03",
    displayDate: "3 October 2026",
    time: "10:00 AM",
    venue: "Chitkara University Auditorium",
    city: "Tricity",
    rating: 4.9,
    price: 0,
    organizer: "FutureTech Community",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80",
    description: "Discover emerging technologies, innovation and future career opportunities through expert sessions."
},

{
    id: 21,
    title: "AI Career & Skills Conference",
    category: "Education",
    zone: "Mohali",
    date: "2026-10-30",
    displayDate: "30 October 2026",
    time: "10:30 AM",
    venue: "Mohali Knowledge Centre",
    city: "Mohali",
    rating: 4.8,
    price: 199,
    organizer: "SkillForward",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    description: "Learn about AI careers, practical skills, industry trends and opportunities from experienced professionals."
},

{
    id: 22,
    title: "Youth Leadership Workshop",
    category: "Education",
    zone: "Chandigarh",
    date: "2026-11-15",
    displayDate: "15 November 2026",
    time: "11:00 AM",
    venue: "Chitkara Seminar Hall",
    city: "Chandigarh",
    rating: 4.5,
    price: 0,
    organizer: "Youth Leadership Forum",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1000&q=80",
    description: "A practical learning experience focused on leadership, communication, teamwork and confidence."
}

];

export const weatherLocations = {

    Chandigarh: {
        latitude: 30.7333,
        longitude: 76.7794
    },

    Panchkula: {
        latitude: 30.6942,
        longitude: 76.8606
    },

    Mohali: {
        
        latitude: 30.7046,
        longitude: 76.7179
    },

    Tricity: {
        latitude: 30.7333,
        longitude: 76.7794
    }

};
