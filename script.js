/* =====================================================
   EVENTVERSE
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   EVENT DATA
===================================================== */

const events = [

    {
        id: 1,

        title: "Neon Nights Festival",

        category: "Music",

        zone: "Central",

        date: "2026-09-12",

        displayDate: "12 September 2026",

        time: "6:30 PM",

        venue: "City Open Air Arena",

        city: "Chandigarh",

        rating: 4.9,

        price: 499,

        organizer: "EventVerse Live",

        image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",

        description:
            "A high-energy evening of live music, lights, artists and unforgettable festival moments."
    },


    {
        id: 2,

        title: "Punjab Heritage Utsav",

        category: "Cultural",

        zone: "North",

        date: "2026-09-18",

        displayDate: "18 September 2026",

        time: "4:00 PM",

        venue: "Heritage Ground",

        city: "Patiala",

        rating: 4.8,

        price: 199,

        organizer: "District Culture Council",

        image:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",

        description:
            "Celebrate local culture, traditional performances, food, crafts and music."
    },


    {
        id: 3,

        title: "District Sports Carnival",

        category: "Sports",

        zone: "South",

        date: "2026-09-25",

        displayDate: "25 September 2026",

        time: "9:00 AM",

        venue: "University Sports Complex",

        city: "Rajpura",

        rating: 4.7,

        price: 99,

        organizer: "District Sports Association",

        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",

        description:
            "A full-day sports celebration featuring athletics, football, basketball and team competitions."
    },


    {
        id: 4,

        title: "FutureTech Summit",

        category: "Education",

        zone: "Central",

        date: "2026-10-03",

        displayDate: "3 October 2026",

        time: "10:00 AM",

        venue: "Chitkara University Auditorium",

        city: "Rajpura",

        rating: 4.9,

        price: 0,

        organizer: "Chitkara Innovation Club",

        image:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80",

        description:
            "Meet innovators, developers and students at a technology-focused summit."
    },


    {
        id: 5,

        title: "Indie Beats Live",

        category: "Music",

        zone: "South",

        date: "2026-10-10",

        displayDate: "10 October 2026",

        time: "7:00 PM",

        venue: "Riverside Amphitheatre",

        city: "Mohali",

        rating: 4.6,

        price: 299,

        organizer: "Indie Collective",

        image:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=80",

        description:
            "Discover independent artists and experience a night filled with fresh sounds."
    },


    {
        id: 6,

        title: "Youth Leadership Workshop",

        category: "Education",

        zone: "North",

        date: "2026-10-17",

        displayDate: "17 October 2026",

        time: "11:00 AM",

        venue: "Chitkara Seminar Hall",

        city: "Rajpura",

        rating: 4.5,

        price: 0,

        organizer: "Youth Council",

        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",

        description:
            "Develop communication, teamwork and leadership skills through interactive sessions."
    }

];


/* =====================================================
   GLOBAL STATE
===================================================== */

let selectedEvent = null;

let selectedSeats = [];

let currentUser =
    JSON.parse(
        localStorage.getItem("eventverseUser")
    ) || null;

let wishlist =
    JSON.parse(
        localStorage.getItem("eventverseWishlist")
    ) || [];

let bookings =
    JSON.parse(
        localStorage.getItem("eventverseBookings")
    ) || [];


/* =====================================================
   PAGE ELEMENTS
===================================================== */

const pages = {

    home:
        document.getElementById("homePage"),

    events:
        document.getElementById("eventsPage"),

    details:
        document.getElementById("detailsPage"),

    register:
        document.getElementById("registerPage"),

    ticket:
        document.getElementById("ticketPage"),

    login:
        document.getElementById("loginPage"),

    dashboard:
        document.getElementById("dashboardPage"),

    notFound:
        document.getElementById("notFoundPage")

};


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadEvents();

        renderFeaturedEvents();

        renderEvents();

        updateLoginUI();

        updateDashboard();

        applySavedTheme();

        handleInitialRoute();

    }
);


/* =====================================================
   ASYNC / PROMISE DEMO
===================================================== */

async function loadEvents() {

    /*
       In a real application this could be:

       const response = await fetch("events.json");

       For this frontend project our event data
       is already stored in JavaScript.
    */

    return new Promise(
        resolve => {

            setTimeout(
                () => {

                    console.log(
                        "Event data loaded successfully."
                    );

                    resolve(events);

                },
                200
            );

        }
    );

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageName) {

    Object.values(pages).forEach(
        page => {

            page.classList.remove("active");

        }
    );


    if (!pages[pageName]) {

        pages.notFound.classList.add("active");

        window.scrollTo(0, 0);

        return;

    }


    pages[pageName].classList.add("active");

    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );


    if (pageName === "events") {

        renderEvents();

    }


    if (pageName === "dashboard") {

        if (!currentUser) {

            showPage("login");

            showToast(
                "Please login to view your dashboard."
            );

            return;

        }

        updateDashboard();

    }


    if (pageName === "home") {

        renderFeaturedEvents();

    }

}


/* =====================================================
   URL / HASH ROUTING
===================================================== */

function handleInitialRoute() {

    const hash =
        window.location.hash;


    if (hash.startsWith("#event-")) {

        const id =
            Number(
                hash.replace("#event-", "")
            );

        openEvent(id);

        return;

    }


    if (hash === "#events") {

        showPage("events");

        return;

    }


    if (hash === "#dashboard") {

        showPage("dashboard");

        return;

    }


    if (hash === "#login") {

        showPage("login");

        return;

    }


    showPage("home");

}


window.addEventListener(
    "hashchange",
    handleInitialRoute
);


/* =====================================================
   FEATURED EVENTS
===================================================== */

function renderFeaturedEvents() {

    const container =
        document.getElementById(
            "featuredEvents"
        );


    if (!container) return;


    const featured =
        events.slice(0, 3);


    container.innerHTML =
        featured
            .map(event => createEventCard(event))
            .join("");

}


/* =====================================================
   EVENT CARD
===================================================== */

function createEventCard(event) {

    const isSaved =
        wishlist.includes(event.id);


    const priceText =
        event.price === 0
            ? "FREE"
            : `₹${event.price}`;


    return `

        <article class="event-card">

            <div class="event-card-image">

                <img
                    src="${event.image}"
                    alt="${event.title}"
                >

                <span class="event-card-category">
                    ${event.category}
                </span>

                <button
                    class="wishlist-btn
                    ${isSaved ? "active" : ""}"
                    onclick="toggleWishlist(${event.id})"
                    aria-label="Save event"
                >

                    <i class="${
                        isSaved
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-heart"></i>

                </button>

            </div>


            <div class="event-card-content">

                <span class="event-date">
                    ${event.displayDate}
                </span>

                <h3>
                    ${event.title}
                </h3>

                <p class="event-description">
                    ${event.description}
                </p>


                <div class="event-meta">

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${event.venue}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${event.time}
                    </span>

                    <span>
                        <i class="fa-solid fa-star"></i>
                        ${event.rating} rating
                    </span>

                </div>


                <div class="event-card-footer">

                    <span class="event-price">
                        ${priceText}
                        ${
                            event.price > 0
                            ? "<small> onwards</small>"
                            : ""
                        }
                    </span>

                    <button
                        class="view-event-btn"
                        onclick="openEvent(${event.id})"
                    >
                        Explore
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   RENDER EVENTS
===================================================== */

function renderEvents() {

    const container =
        document.getElementById(
            "allEvents"
        );


    if (!container) return;


    const search =
        (
            document.getElementById(
                "searchInput"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const category =
        document.getElementById(
            "categoryFilter"
        )?.value || "All";


    const zone =
        document.getElementById(
            "zoneFilter"
        )?.value || "All";


    const sort =
        document.getElementById(
            "sortFilter"
        )?.value || "date";


    let filtered =
        events.filter(
            event => {

                const matchesSearch =

                    event.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    event.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    event.venue
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =

                    category === "All"
                    ||
                    event.category === category;


                const matchesZone =

                    zone === "All"
                    ||
                    event.zone === zone;


                return (
                    matchesSearch
                    &&
                    matchesCategory
                    &&
                    matchesZone
                );

            }
        );


    /* SORT */

    if (sort === "rating") {

        filtered.sort(
            (a,b) =>
                b.rating - a.rating
        );

    }


    else if (sort === "price") {

        filtered.sort(
            (a,b) =>
                a.price - b.price
        );

    }


    else {

        filtered.sort(
            (a,b) =>
                new Date(a.date)
                -
                new Date(b.date)
        );

    }


    const count =
        document.getElementById(
            "resultsCount"
        );


    if (count) {

        count.textContent =
            `${filtered.length} ${
                filtered.length === 1
                ? "event"
                : "events"
            }`;

    }


    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-magnifying-glass"
                   style="font-size:2rem;color:var(--primary);margin-bottom:15px;">
                </i>

                <h3>
                    No events found
                </h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(event => createEventCard(event))
            .join("");

}


/* =====================================================
   HOME CATEGORY FILTER
===================================================== */

function filterFromHome(category) {

    showPage("events");


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (categoryFilter) {

        categoryFilter.value =
            category;

    }


    renderEvents();

}


/* =====================================================
   OPEN EVENT
===================================================== */

function openEvent(id) {

    selectedEvent =
        events.find(
            event => event.id === id
        );


    if (!selectedEvent) {

        showPage("notFound");

        return;

    }


    selectedSeats = [];


    window.location.hash =
        `event-${id}`;


    renderEventDetails();

    showPage("details");

}


/* =====================================================
   EVENT DETAILS
===================================================== */

function renderEventDetails() {

    const container =
        document.getElementById(
            "eventDetails"
        );


    const event =
        selectedEvent;


    if (!event) return;


    const priceText =
        event.price === 0
            ? "Free"
            : `₹${event.price}`;


    container.innerHTML = `

        <div class="details-container">


            <div class="details-image">

                <img
                    src="${event.image}"
                    alt="${event.title}"
                >

            </div>


            <div class="details-info">

                <button
                    class="back-btn"
                    onclick="showPage('events')"
                >

                    <i class="fa-solid fa-arrow-left"></i>

                    Back to events

                </button>


                <span class="details-category">

                    ${event.category}
                    ·
                    ${event.zone} ZONE

                </span>


                <h1>
                    ${event.title}
                </h1>


                <p class="details-description">

                    ${event.description}

                </p>


                <div class="details-meta">

                    <div class="detail-meta-card">

                        <i class="fa-regular fa-calendar"></i>

                        <strong>
                            Date
                        </strong>

                        <span>
                            ${event.displayDate}
                        </span>

                    </div>


                    <div class="detail-meta-card">

                        <i class="fa-regular fa-clock"></i>

                        <strong>
                            Time
                        </strong>

                        <span>
                            ${event.time}
                        </span>

                    </div>


                    <div class="detail-meta-card">

                        <i class="fa-solid fa-location-dot"></i>

                        <strong>
                            Venue
                        </strong>

                        <span>
                            ${event.venue}
                        </span>

                    </div>


                    <div class="detail-meta-card">

                        <i class="fa-solid fa-user-group"></i>

                        <strong>
                            Organizer
                        </strong>

                        <span>
                            ${event.organizer}
                        </span>

                    </div>

                </div>


                <div class="seat-section">

                    <h2>
                        Select your seats
                    </h2>

                    <div class="stage">
                        STAGE
                    </div>


                    <div class="seat-grid">

                        ${createSeats()}

                    </div>


                    <div class="seat-summary">

                        <div class="total-price">

                            <strong id="seatTotal">
                                ₹0
                            </strong>

                            <span id="seatCount">
                                No seats selected
                            </span>

                        </div>


                        <button
                            class="primary-btn"
                            onclick="continueRegistration()"
                        >

                            Continue

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   CREATE SEATS
===================================================== */

function createSeats() {

    const reservedSeats =
        [3, 7, 14, 19, 25, 31, 38, 45];


    return Array.from(
        { length: 48 },
        (_, index) => {

            const seatNumber =
                index + 1;


            const reserved =
                reservedSeats
                    .includes(seatNumber);


            return `

                <button
                    class="seat ${
                        reserved
                        ? "reserved"
                        : ""
                    }"
                    ${
                        reserved
                        ? "disabled"
                        : ""
                    }
                    onclick="selectSeat(${seatNumber})"
                >

                    ${seatNumber}

                </button>

            `;

        }
    ).join("");

}


/* =====================================================
   SEAT SELECTION
===================================================== */

function selectSeat(number) {

    if (
        selectedSeats.includes(number)
    ) {

        selectedSeats =
            selectedSeats.filter(
                seat => seat !== number
            );

    }


    else {

        if (selectedSeats.length >= 6) {

            showToast(
                "You can select up to 6 seats."
            );

            return;

        }


        selectedSeats.push(number);

    }


    updateSeats();

}


/* =====================================================
   UPDATE SEATS
===================================================== */

function updateSeats() {

    document
        .querySelectorAll(".seat")
        .forEach(
            button => {

                const number =
                    Number(button.textContent.trim());


                button.classList.toggle(
                    "selected",
                    selectedSeats
                        .includes(number)
                );

            }
        );


    const total =
        selectedSeats.length *
        (
            selectedEvent?.price || 0
        );


    const totalElement =
        document.getElementById(
            "seatTotal"
        );


    const countElement =
        document.getElementById(
            "seatCount"
        );


    if (totalElement) {

        totalElement.textContent =
            selectedEvent?.price === 0
            ? "FREE"
            : `₹${total}`;

    }


    if (countElement) {

        countElement.textContent =
            selectedSeats.length === 0
            ? "No seats selected"
            : `${selectedSeats.length} ${
                selectedSeats.length === 1
                ? "seat"
                : "seats"
            } selected`;

    }

}


/* =====================================================
   CONTINUE REGISTRATION
===================================================== */

function continueRegistration() {

    if (!selectedEvent) {

        return;

    }


    if (selectedSeats.length === 0) {

        showToast(
            "Please select at least one seat."
        );

        return;

    }


    if (!currentUser) {

        showToast(
            "Please login before registering."
        );

        showPage("login");

        return;

    }


    const summary =
        document.getElementById(
            "bookingSummary"
        );


    const total =
        selectedSeats.length *
        selectedEvent.price;


    summary.innerHTML = `

        <strong>
            ${selectedEvent.title}
        </strong>

        <p style="color:var(--muted);font-size:.8rem;margin-top:7px;">

            ${selectedEvent.displayDate}

            ·

            ${selectedEvent.time}

            <br>

            ${selectedEvent.venue}

        </p>

        <div style="margin-top:15px;
                    display:flex;
                    justify-content:space-between;
                    font-size:.8rem;">

            <span>
                Seats:
                ${selectedSeats.join(", ")}
            </span>

            <strong>
                ${total === 0 ? "FREE" : "₹" + total}
            </strong>

        </div>

    `;


    showPage("register");

}


/* =====================================================
   REGISTRATION
===================================================== */

function submitRegistration(event) {

    event.preventDefault();


    if (!selectedEvent) {

        return;

    }


    const name =
        document.getElementById(
            "regName"
        ).value.trim();


    const email =
        document.getElementById(
            "regEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "regPhone"
        ).value.trim();


    const city =
        document.getElementById(
            "regCity"
        ).value.trim();


    if (
        name.length < 2
        ||
        phone.length !== 10
    ) {

        showToast(
            "Please enter valid details."
        );

        return;

    }


    const booking = {

        id:
            "EV-" +
            Date.now()
                .toString()
                .slice(-7),

        eventId:
            selectedEvent.id,

        eventTitle:
            selectedEvent.title,

        date:
            selectedEvent.displayDate,

        time:
            selectedEvent.time,

        venue:
            selectedEvent.venue,

        seats:
            [...selectedSeats],

        attendee:
            name,

        email:
            email,

        phone:
            phone,

        city:
            city,

        total:
            selectedSeats.length *
            selectedEvent.price

    };


    bookings.push(booking);


    localStorage.setItem(
        "eventverseBookings",
        JSON.stringify(bookings)
    );


    generateTicket(booking);

    document
        .getElementById("registrationForm")
        .reset();

    showPage("ticket");

}


/* =====================================================
   GENERATE TICKET
===================================================== */

function generateTicket(booking) {

    const ticket =
        document.getElementById(
            "ticket"
        );


    ticket.innerHTML = `

        <div class="ticket-top">

            <div class="ticket-brand">

                <i class="fa-solid fa-ticket"></i>

                EventVerse

            </div>

            <div class="ticket-type">

                DIGITAL EVENT PASS

            </div>

        </div>


        <div class="ticket-main">

            <h2>
                ${booking.eventTitle}
            </h2>


            <div class="ticket-details">

                <div>

                    <span>
                        Date
                    </span>

                    <strong>
                        ${booking.date}
                    </strong>

                </div>


                <div>

                    <span>
                        Time
                    </span>

                    <strong>
                        ${booking.time}
                    </strong>

                </div>


                <div>

                    <span>
                        Venue
                    </span>

                    <strong>
                        ${booking.venue}
                    </strong>

                </div>


                <div>

                    <span>
                        Seats
                    </span>

                    <strong>
                        ${booking.seats.join(", ")}
                    </strong>

                </div>

            </div>

        </div>


        <div class="ticket-divider"></div>


        <div class="ticket-bottom">

            <div>

                <div class="ticket-details">

                    <div>

                        <span>
                            Guest
                        </span>

                        <strong>
                            ${booking.attendee}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Pass ID
                        </span>

                        <strong>
                            ${booking.id}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="qr">

                ${generateQR()}

            </div>

        </div>

    `;

}


/* =====================================================
   FAKE QR CODE
===================================================== */

function generateQR() {

    return Array.from(
        { length: 100 },
        () => {

            return `<span></span>`;

        }
    ).join("");

}


/* =====================================================
   WISHLIST
===================================================== */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

        showToast(
            "Removed from wishlist."
        );

    }


    else {

        wishlist.push(id);

        showToast(
            "Event saved to wishlist ❤️"
        );

    }


    localStorage.setItem(
        "eventverseWishlist",
        JSON.stringify(wishlist)
    );


    renderEvents();

    renderFeaturedEvents();

    updateDashboard();

}


/* =====================================================
   LOGIN
===================================================== */

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const storedUser =
        JSON.parse(
            localStorage.getItem(
                "eventverseAccount"
            )
        );


    if (
        !storedUser
        ||
        storedUser.email !== email
        ||
        storedUser.password !== password
    ) {

        showToast(
            "Invalid login details."
        );

        return;

    }


    currentUser = {

        name:
            storedUser.name,

        email:
            storedUser.email

    };


    localStorage.setItem(
        "eventverseUser",
        JSON.stringify(currentUser)
    );


    showToast(
        `Welcome back, ${currentUser.name}!`
    );


    updateLoginUI();

    showPage("dashboard");

}


/* =====================================================
   SIGNUP
===================================================== */

function signupUser(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "signupName"
        ).value.trim();


    const email =
        document.getElementById(
            "signupEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "signupPassword"
        ).value;


    const confirm =
        document.getElementById(
            "confirmPassword"
        ).value;


    if (password !== confirm) {

        showToast(
            "Passwords do not match."
        );

        return;

    }


    if (password.length < 6) {

        showToast(
            "Password must contain at least 6 characters."
        );

        return;

    }


    const account = {

        name,
        email,
        password

    };


    localStorage.setItem(
        "eventverseAccount",
        JSON.stringify(account)
    );


    currentUser = {

        name,
        email

    };


    localStorage.setItem(
        "eventverseUser",
        JSON.stringify(currentUser)
    );


    showToast(
        "Account created successfully!"
    );


    updateLoginUI();

    showPage("dashboard");

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "eventverseUser"
    );


    updateLoginUI();

    showToast(
        "You have been logged out."
    );


    showPage("home");

}


/* =====================================================
   LOGIN UI
===================================================== */

function updateLoginUI() {

    const text =
        document.getElementById(
            "loginText"
        );


    if (!text) return;


    if (currentUser) {

        text.textContent =
            currentUser.name
                .split(" ")[0];

    }


    else {

        text.textContent =
            "Login";

    }

}


/* =====================================================
   AUTH SWITCH
===================================================== */

function switchAuth(mode) {

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const signupForm =
        document.getElementById(
            "signupForm"
        );


    const loginTab =
        document.getElementById(
            "loginTab"
        );


    const signupTab =
        document.getElementById(
            "signupTab"
        );


    if (mode === "login") {

        loginForm.classList.remove(
            "hidden"
        );

        signupForm.classList.add(
            "hidden"
        );

        loginTab.classList.add(
            "active"
        );

        signupTab.classList.remove(
            "active"
        );

    }


    else {

        loginForm.classList.add(
            "hidden"
        );

        signupForm.classList.remove(
            "hidden"
        );

        loginTab.classList.remove(
            "active"
        );

        signupTab.classList.add(
            "active"
        );

    }

}


/* =====================================================
   PASSWORD VISIBILITY
===================================================== */

function togglePassword(id) {

    const input =
        document.getElementById(id);


    if (
        input.type === "password"
    ) {

        input.type = "text";

    }


    else {

        input.type = "password";

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    if (!currentUser) {

        return;

    }


    const greeting =
        document.getElementById(
            "dashboardGreeting"
        );


    if (greeting) {

        greeting.textContent =
            `Welcome back, ${
                currentUser.name
            } 👋`;

    }


    const passCount =
        document.getElementById(
            "passCount"
        );


    const savedCount =
        document.getElementById(
            "savedCount"
        );


    if (passCount) {

        passCount.textContent =
            bookings.length;

    }


    if (savedCount) {

        savedCount.textContent =
            wishlist.length;

    }


    renderPasses();

    renderWishlist();

}


/* =====================================================
   MY PASSES
===================================================== */

function renderPasses() {

    const container =
        document.getElementById(
            "myPasses"
        );


    if (!container) return;


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No passes yet 🎟
                </h3>

                <p>
                    Register for an event to see
                    your digital pass here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bookings
            .map(
                booking => `

                <div class="pass-card">

                    <span class="eyebrow">
                        DIGITAL PASS
                    </span>

                    <h3>
                        ${booking.eventTitle}
                    </h3>

                    <p>
                        ${booking.date}
                        ·
                        ${booking.time}
                    </p>

                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${booking.venue}
                    </p>

                    <div class="pass-card-footer">

                        <span>
                            Seats:
                            <strong>
                                ${booking.seats.join(", ")}
                            </strong>
                        </span>

                        <button
                            class="view-event-btn"
                            onclick="showBookingTicket('${booking.id}')"
                        >

                            View Pass

                        </button>

                    </div>

                </div>

            `
            )
            .join("");

}


/* =====================================================
   SHOW BOOKING TICKET
===================================================== */

function showBookingTicket(id) {

    const booking =
        bookings.find(
            item => item.id === id
        );


    if (!booking) return;


    generateTicket(booking);

    showPage("ticket");

}


/* =====================================================
   WISHLIST DASHBOARD
===================================================== */

function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistEvents"
        );


    if (!container) return;


    const savedEvents =
        events.filter(
            event =>
                wishlist.includes(event.id)
        );


    if (savedEvents.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Your wishlist is empty ❤️
                </h3>

                <p>
                    Save events you don't want to miss.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        savedEvents
            .map(
                event =>
                    createEventCard(event)
            )
            .join("");

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "eventverseTheme",
        isDark
            ? "dark"
            : "light"
    );


    updateThemeIcon();

}


function applySavedTheme() {

    const theme =
        localStorage.getItem(
            "eventverseTheme"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeIcon();

}


function updateThemeIcon() {

    const icon =
        document.getElementById(
            "themeIcon"
        );


    if (!icon) return;


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    icon.className =
        isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";

}


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMenu() {

    document
        .getElementById("mobileMenu")
        .classList.toggle("show");

}


/* =====================================================
   CHATBOT
===================================================== */

function openChat() {

    document
        .getElementById("chatbot")
        .classList.add("show");

}


function closeChat() {

    document
        .getElementById("chatbot")
        .classList.remove("show");

}


/* =====================================================
   EVE AI
===================================================== */

function askEve(topic) {

    const responses = {

        events:
            "We have music, cultural, sports and educational events across the district. Open Discover to explore them! 🎭",

        music:
            "There are several music experiences coming up, including Neon Nights Festival and Indie Beats Live. 🎵",

        free:
            "Yes! FutureTech Summit and Youth Leadership Workshop currently have free registration. 🎟",

        register:
            "Choose an event, select your seats, login and complete the registration form. I'll help you all the way! ✨"

    };


    addBotMessage(
        responses[topic]
        ||
        "Try asking me about events, music, free events or registration."
    );

}


/* =====================================================
   CHAT MESSAGE
===================================================== */

function sendChat(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "chatInput"
        );


    const message =
        input.value.trim();


    if (!message) return;


    addUserMessage(message);


    input.value = "";


    setTimeout(
        () => {

            const text =
                message.toLowerCase();


            let response;


            if (
                text.includes("music")
                ||
                text.includes("concert")
            ) {

                response =
                    "🎵 You should check out Neon Nights Festival and Indie Beats Live!";

            }


            else if (
                text.includes("free")
                ||
                text.includes("no cost")
            ) {

                response =
                    "🎟 FutureTech Summit and Youth Leadership Workshop are currently free.";

            }


            else if (
                text.includes("register")
                ||
                text.includes("booking")
            ) {

                response =
                    "📝 Select an event → choose seats → login → fill the registration form → receive your digital pass.";

            }


            else if (
                text.includes("event")
            ) {

                response =
                    "🎭 We have Music, Cultural, Sports and Education events. Click Discover Events to explore.";

            }


            else if (
                text.includes("seat")
            ) {

                response =
                    "💺 Open an event and select any available seats. Reserved seats are shown as unavailable.";

            }


            else {

                response =
                    "✨ I'm Eve! Try asking me about events, music, free events, seats or registration.";

            }


            addBotMessage(response);

        },
        500
    );

}


/* =====================================================
   CHAT UI
===================================================== */

function addUserMessage(message) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    container.insertAdjacentHTML(
        "beforeend",
        `
            <div class="user-message">
                ${escapeHTML(message)}
            </div>
        `
    );


    container.scrollTop =
        container.scrollHeight;

}


function addBotMessage(message) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    container.insertAdjacentHTML(
        "beforeend",
        `
            <div class="bot-message">
                ${message}
            </div>
        `
    );


    container.scrollTop =
        container.scrollHeight;

}


/* =====================================================
   SECURITY / HTML ESCAPE
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const text =
        document.getElementById(
            "toastText"
        );


    text.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}