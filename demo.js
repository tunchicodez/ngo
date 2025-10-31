// Demo button functionality
document.addEventListener('DOMContentLoaded', function() {
    const demoButton = document.getElementById('demo-button');
    const demoButtonMobile = document.getElementById('demo-button-mobile');
    
    function handleDemoClick() {
        // Replace this with your actual demo functionality
        alert('Demo mode activated! This is where your interactive demo would start.');
        
        // Example of what could be added:
        // - Show a modal with demo options
        // - Start a guided tour
        // - Load sample content
        // - Enable test features
    }

    // Add click handlers to both desktop and mobile buttons
    if (demoButton) {
        demoButton.addEventListener('click', handleDemoClick);
    }
    if (demoButtonMobile) {
        demoButtonMobile.addEventListener('click', handleDemoClick);
    }
});