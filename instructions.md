# instructions.md

**Intro Note:**  
This document provides step-by-step instructions for implementing Phase 1 of a SaaS platform designed for multiple businesses to showcase and allow clients to book their talents. The platform’s primary purpose is to let businesses create profiles for their talents, display information, images (later videos), and enable potential clients to explore and initiate booking requests. In this initial phase, you will establish the foundational components: business account management, basic talent profiles, secure authentication, a simple booking request form, and a clean, modern frontend layout. The platform should run locally first, using SQLite for development, and can be scaled to Postgres in production. All pages must be server-rendered so clients cannot directly access any internal API endpoints. Interactions should occur solely through form submissions and server-side operations for improved security and scalability.

Additionally, the frontend layout should be implemented in React, styled using a modern CSS framework or utility classes (like TailwindCSS) to achieve a clean, minimalistic look. The structure should be modular, with separate components for navigation, headers, and page sections.

---

### Instructions for the Developer (Phase 1)

1. **Project Setup**  
   - Create a new directory on your local machine dedicated to this SaaS booking platform.

2. **Dependency Management**  
   - Initialize a `package.json` to manage dependencies.  
   - Decide on using Next.js or Express.js for the backend. Both can produce server-side rendered pages. If Next.js is chosen, utilize built-in SSR features. If using Express.js, integrate a templating engine to produce fully rendered HTML pages.

3. **Frontend Integration & Styling**  
   - Integrate React for UI components.  
   - Choose a modern CSS framework or utility-based styling approach such as TailwindCSS.  
   - Configure TailwindCSS (or your chosen styling approach) for spacing, typography, colors, and subtle rounded corners.  
   - Aim for a clean, modern, and minimalistic design with neutral backgrounds and comfortable font sizes.  
   - Ensure all pages and components are server-rendered—no direct JSON endpoints should be exposed.

4. **Modular Component Structure**  
   - Organize your React components into a modular structure:
     - **Sidebar Component:** A vertical navigation menu for business admins (e.g., links to Dashboard, Talents, Bookings).  
     - **Header Component:** A top-level header displaying the business name, a status indicator (e.g., “In Progress” for current operational mode), and an area for future dropdowns or actions.  
     - **Tab Navigation Component:** For pages that have multiple tabs (e.g., Overview, Bookings, etc.), create a tab navigation component that can render different active states.  
     - **Cards and Sections:** On a dashboard or overview page, create separate card components (e.g., a Talent Summary Card, a Booking Requests Card, a Business Profile Info Card) to neatly display information.  
   - Place these components together in an `App.js` or `index.js` file, which imports and composes them into the final layout.  
   - The structure should allow easy maintenance and future expansion (e.g., adding pages or modifying the layout without major rewrites).

5. **Environment and Database Configuration**  
   - Create an `.env` file for environment variables (database connection strings, session secrets).  
   - Use SQLite locally for development.  
   - Set up a migration or schema tool to easily switch to Postgres later in production environments.

6. **Schema Planning (Phase 1)**  
   - Define a schema that includes:  
     - **Businesses**: Stores business details (email, password hash, business name, logo path, contact info).  
     - **Talents**: Each talent is associated with a business, with fields such as name, description, and a single image path.  
     - **Booking Requests**: A minimal table to store client-submitted booking requests, including client’s name, email, requested talent ID, and a message/notes field.

7. **Secure Authentication for Businesses**  
   - Implement a form-based sign-up and login flow for businesses.  
   - On sign-up, validate inputs and create a new Business record. Hash/salt the password before storing it.  
   - On login, validate credentials and establish a server-side session (e.g., secure cookies) to track authenticated sessions.  
   - Restrict admin pages (business dashboard) to authenticated users only.

8. **Business Profile Management**  
   - Create a server-rendered dashboard page accessible only to logged-in Business Admins.  
   - Include a form to update business profile details (e.g., contact info, logo image).  
   - On submission, validate inputs, update the database, handle image uploads on the server, and re-render the dashboard with updated info.

9. **Talent Creation (Basic Profile)**  
   - Add a server-rendered form on the dashboard that allows a business admin to create a new Talent record.  
   - On submission, validate input (name, basic description), insert the new Talent into the database, and re-render a page (e.g., a talents list) showing the newly added talent.  
   - Handle image upload: on submission, store the image file on the server and associate it with the Talent record.

10. **Public Talent Listings & Booking Requests**  
    - Implement a server-rendered, public-facing page to list all talents for a given business, displaying talent names, images, and brief descriptions.  
    - Include a detail page for each talent. On that page, add a booking request form where clients can provide their name, email, and a brief message.  
    - On form submission for a booking request, validate inputs, insert a new Booking Request record into the database, and then re-render a confirmation page or message.

11. **No Public API Endpoints**  
    - Do not expose any JSON endpoints to the client.  
    - All interactions must occur through page navigation and form submissions.  
    - The client should not call `fetch` or `axios` to internal endpoints—only form submissions and server-rendered pages.

12. **Validation and Error Handling**  
    - Validate all form inputs on the server.  
    - If validation fails, re-render the page with error messages rather than returning any raw API errors.  
    - Provide clear, user-friendly error feedback.

13. **Sessions and Security**  
    - Use secure session handling for authentication.  
    - Mark cookies as HttpOnly and Secure (where possible) to mitigate common attack vectors.  
    - Protect against SQL injection and other vulnerabilities by using prepared statements or an ORM.

14. **Testing & Verification**  
    - Write basic tests for key workflows: sign-up, login, creating a talent, and submitting a booking request.  
    - Run tests locally to ensure logic works as intended.  
    - Manually verify the flows: sign-up → login → add talent → view public listing → submit booking request.

15. **Localhost Execution**  
    - Run the application at `http://localhost:<port>` and verify that you can browse pages, sign up, log in, and create a talent.  
    - Check the browser’s network activity and confirm no direct API calls are made—only form submissions and page loads.

16. **Documentation**  
    - Document implemented workflows, components, forms, and pages.  
    - Prepare notes for future phases that will introduce more advanced features such as dynamic scheduling, pricing models, and integrated payment workflows.

---

By following these instructions, you will build the foundation of a secure and scalable SaaS booking platform. You will have a clean, modern, and minimalistic frontend layout (using TailwindCSS or a similar framework) structured into modular React components. The result is a fully server-rendered environment that handles business sign-ups, talent creation, basic booking requests, and a professional UI—all without exposing direct APIs to the client.
