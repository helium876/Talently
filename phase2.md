# instructions_phase_2.md

**Intro Note:**  
In Phase 1.2, you established a server-rendered SaaS platform enabling multiple businesses to sign up, log in, manage basic business information, create simple talent profiles, and accept basic booking requests. The system uses HTML forms and server-side rendering, with no direct API endpoints accessible by clients, ensuring high security and maintainability.

In Phase 2, you will enhance the platform by introducing services and pricing for each talent, allowing businesses to define their talents’ availability, and improving the public booking experience so clients can select specific services and time slots. You will also enable the business admin to confirm or reject bookings and introduce basic email notifications. All improvements should continue to follow the same pattern: fully server-rendered pages, form submissions for all interactions, no client-side API calls, and a visually consistent and user-friendly interface styled similarly to Phase 1.

---

### Instructions for the Developer (Phase 2)

1. **Add Services and Pricing to Talents**  
   - In the business admin dashboard, create a new section dedicated to managing a talent’s services.  
   - Render a server-side HTML page that displays a list of the existing talents. Next to each talent, include a labeled HTML button, for example “Manage Services,” which takes the business owner to another server-rendered page dedicated to that specific talent’s services.  
   - On the “Manage Services” page, create an HTML form with labeled input fields for service name, a textarea for a brief description, a numeric input field for the duration (in minutes), and a numeric input field for the price (in a chosen currency). Include a clearly labeled submit button, for example “Add Service.”  
   - When the form is submitted, validate that all fields are properly filled in (e.g., service name is not empty, duration is a positive integer, price is a valid number). If validation fails, re-render the page with a clear error message placed near the invalid field. If validation succeeds, insert the new service into the database, link it to the correct talent, and re-render the page showing the updated list of services.  
   - Ensure that this list of services appears below the form, each service displayed in a simple, styled container that shows its name, description, duration, and price. Include a button near each service to remove or edit it in the future phases (editing can be planned but not necessarily implemented in Phase 2).

2. **Define Availability for Each Talent**  
   - In the business admin dashboard, add a new section labeled “Set Availability” or “Talent Availability.”  
   - On that page, display a list of talents. Next to each talent’s name, include a button or link, for example “Edit Availability,” that leads to a server-rendered page specifically for setting that talent’s weekly schedule.  
   - On the “Edit Availability” page, create an HTML form that allows the business owner to specify available time ranges for each day of the week. For example, include dropdown menus or time inputs for start and end times for Monday through Sunday. Include a “Save Availability” button at the bottom of the form.  
   - When the availability form is submitted, validate that the time ranges are logical (e.g., start time is before end time) and that they do not overlap. If errors occur, re-render the page with error messages clearly displayed. If all validations pass, store the availability data in the database, linked to the talent’s record.  
   - After successful submission, re-render the availability page with a confirmation message, such as “Availability updated successfully,” displayed in a distinct, styled area near the top of the page.  
   - Ensure that the UI for selecting times is consistent and readable. For instance, use simple time fields or select elements, and consider including placeholder text that guides the user (e.g., “Select Start Time”).

3. **Public Booking Page with Service and Time Slot Selection**  
   - On the public-facing talent detail page (the one visible to clients), update the server-rendered output so that it now displays a dropdown or radio buttons for choosing a service. The server should fetch the list of services associated with that talent and embed them directly into the HTML markup.  
   - Below the service selection, add a date picker or a set of date selection fields so the client can choose a desired date for their booking. When the client selects a date and service, the page should be re-rendered by the server (e.g., via a form submission) to show only the time slots available for that date and service’s duration.  
   - Include a server-rendered HTML form that displays available time slots as labeled radio buttons. The server will compute these slots by combining the chosen date with the talent’s weekly availability pattern stored in the database, ensuring that only free times are shown. If no time slots are available, display a friendly message, for example “No available times on this date.”  
   - Once the client selects a service and an available time slot, they should click a clearly labeled button, such as “Request Booking.” On submission, validate the requested timeslot against the database to ensure it is still available. If it has become unavailable, re-render with an error message. Otherwise, create or update the booking request in the database, linking it to the chosen service, date, and time.

4. **Confirming and Rejecting Bookings (Business Admin Side)**  
   - In the business admin dashboard, add a “Bookings” section displaying all pending booking requests. This should be a server-rendered HTML page with a table or list showing the client’s name, chosen service, requested date/time, and any message they provided.  
   - Next to each booking request, include two labeled buttons: “Confirm” and “Reject.” When the admin clicks “Confirm,” display a server-rendered confirmation form that states “Are you sure you want to confirm this booking?” and includes a “Yes, Confirm” button. Similarly, for “Reject,” display a similar confirmation form.  
   - On form submission, if “Yes, Confirm” is clicked, update the booking record in the database to a “Confirmed” status and re-render the bookings list page with a success message, for example “Booking confirmed successfully.” If “Yes, Reject” is clicked, change the booking’s status to “Rejected” and re-render with “Booking rejected.”  
   - If any validation or data integrity check fails during confirmation or rejection (e.g., booking no longer exists), re-render the page with an error message placed near the relevant booking entry.

5. **Basic Email Notifications**  
   - Integrate an email sending mechanism on the server side. For now, keep it simple by configuring environment variables for SMTP credentials in the `.env` file.  
   - Update the logic so that when a booking request is submitted by a client, the server sends an email notification to the business’s email address and an acknowledgment email to the client’s email address. The email should contain basic booking details: talent name, selected service, requested date/time, and the client’s message.  
   - Similarly, when a booking is confirmed by the business admin, send another email to the client notifying them that their booking has been confirmed. If a booking is rejected, send an email stating that the request could not be fulfilled.  
   - Ensure that the email sending process occurs only after successful database updates. If the email fails to send, handle the error gracefully by re-rendering the page with a note indicating that an email notification could not be delivered, but the booking status was still updated in the system.

6. **Consistent UI Styling and Layout Enhancements**  
   - Continue using the same styling approach from Phase 1. Adjust spacing, font sizes, and colors as needed to accommodate the new sections (Services, Availability, Bookings Management).  
   - For forms that are more complex (like availability or service creation), consider grouping related fields together with headings or subtle horizontal lines.  
   - Ensure that form errors, confirmations, and success messages are consistently styled with the same color scheme and font weights as in Phase 1. For example, use a slightly red hue for error messages and a green hue for success messages, ensuring adequate contrast and readability.

7. **No Public API Endpoints and Security Checks**  
   - As in Phase 1, do not introduce any direct JSON endpoints. All data submissions occur through HTML forms and server-rendered pages.  
   - Validate every form submission on the server side, re-rendering the page with explicit error messages if invalid data is detected. For instance, if a service name is missing or a time slot format is incorrect, point that out clearly.  
   - Ensure that only authenticated and authorized business admins can access or modify services, availability, and booking confirmations. If a user without the proper session credentials attempts to access these pages, re-render a login page and display a message instructing them to log in.

8. **Testing & Verification**  
   - Write new tests that simulate creating a service, setting availability, and making a booking request with a chosen service and time slot. Run these tests to confirm that all new workflows function correctly.  
   - Manually test the end-to-end flow: log in as a business, add a service, set availability, then log out. Navigate to the public side, pick a date and service for a talent, request a booking, and verify emails. Log back in as the business admin, confirm the booking, and check the resulting emails and messages displayed on the pages.

9. **Localhost Execution and Final Review**  
   - Run the application on `http://localhost:<port>` and carefully navigate through all new features. Confirm that the styling is consistent and that no direct API calls are visible in browser developer tools.  
   - Double-check that success and error messages appear where expected and that all forms are usable and understandable.

10. **Documentation**  
    - Update your internal documentation to reflect the new features introduced in Phase 2. Include instructions on how to add services, set availability, handle booking confirmations, and troubleshoot email notifications.  
    - Make sure to note any limitations or outstanding tasks to be addressed in future phases.

---

By following these Phase 2 instructions, you will enhance the booking platform with service and pricing details, availability schedules, improved booking flows, and basic email notifications. Throughout the process, you will maintain the server-rendered, secure architecture and consistent user interface established in Phase 1, ensuring a seamless progression toward a more robust booking system.  
