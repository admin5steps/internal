// Training page JavaScript functionality

// Modal initialization (Bootstrap modals are auto-initialized)
document.addEventListener('DOMContentLoaded', function() {
    // Add any training-specific functionality here
    console.log('Training page loaded');
});

// Function to handle continue learning button click
function continueTraining(moduleId) {
    // This can be used to track which module the user is continuing
    sessionStorage.setItem('currentModule', moduleId);
}

// Function to refresh the page
function refreshPage() {
    location.reload();
}
