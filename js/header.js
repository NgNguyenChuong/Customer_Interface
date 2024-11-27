document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Handle mobile search
    const mobileSearchIcon = document.querySelector('.mobile-search-icon');
    const searchContainer = document.querySelector('.search-container');
    
    mobileSearchIcon.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        // Focus vào search input khi mở
        if (searchContainer.classList.contains('active')) {
            searchContainer.querySelector('.search-bar').focus();
        }
    });

    // Đóng search khi click outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container') && 
            !e.target.closest('.mobile-search-icon')) {
            searchContainer.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            searchContainer.classList.remove('active');
        }
    });
}); 