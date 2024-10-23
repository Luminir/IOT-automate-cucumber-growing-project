document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.navbar-toggle');
    
    toggleButton.addEventListener('click', () => {
        console.log("Toggle button clicked");
        // Toggle the "active" class on the sidebar to control its visibility
        sidebar.classList.toggle('sidebar-active');
        console.log("Sidebar class list: ", sidebar.classList);
    });

    // Function to check and adjust sidebar visibility based on window size
    const adjustSidebar = () => {
        const screenWidth = window.innerWidth;
        const desktopWidth = 992; // Define the breakpoint for desktop view

        // If the screen width is greater than or equal to the desktop width
        if (screenWidth >= desktopWidth) {
            sidebar.classList.add('sidebar-active'); // Always show sidebar in desktop view
            console.log('Sidebar activated for desktop mode');
        } else {
            sidebar.classList.remove('sidebar-active'); // Optional: Hide sidebar in mobile view
            console.log('Sidebar hidden for mobile mode');
        }
    };

    // Initial check on page load
    adjustSidebar();

    // Listen for window resize
    window.addEventListener('resize', adjustSidebar);
});

