/**
 * Pagination Manager
 * Handles pagination for multiple sections with customizable items per page
 */

class PaginationManager {
    constructor(containerId, itemsPerPage = 6) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.items = Array.from(this.container.children).filter(child => 
            !child.classList.contains('pagination-controls')
        );
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        
        // Add pagination-item class to all items
        this.items.forEach(item => item.classList.add('pagination-item'));
        
        this.init();
    }
    
    init() {
        if (this.items.length <= this.itemsPerPage) {
            // No pagination needed
            this.items.forEach(item => item.classList.add('active'));
            return;
        }
        
        this.createControls();
        this.showPage(1);
    }
    
    createControls() {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'pagination-controls';
        controlsDiv.innerHTML = `
            <div class="pagination-info">
                <span class="current-items"></span>
            </div>
            <div class="pagination-container">
                <button class="pagination-btn prev-btn" data-action="prev">
                    <i class="fas fa-chevron-left"></i>
                    <span>Previous</span>
                </button>
                <div class="pagination-numbers"></div>
                <button class="pagination-btn next-btn" data-action="next">
                    <span>Next</span>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        // Insert pagination controls AFTER the grid container (outside of it)
        // This prevents pagination from being affected by grid layout
        this.container.parentNode.insertBefore(controlsDiv, this.container.nextSibling);
        
        // Add event listeners
        controlsDiv.querySelector('.prev-btn').addEventListener('click', () => this.prevPage());
        controlsDiv.querySelector('.next-btn').addEventListener('click', () => this.nextPage());
        
        this.controlsDiv = controlsDiv;
        this.updateControls();
    }
    
    showPage(pageNumber) {
        this.currentPage = pageNumber;
        
        // Hide all items
        this.items.forEach(item => item.classList.remove('active'));
        
        // Show items for current page
        const start = (pageNumber - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.items.slice(start, end);
        
        pageItems.forEach(item => item.classList.add('active'));
        
        // Scroll to top of section with offset to keep pagination visible
        const section = this.container.closest('section');
        if (section) {
            const yOffset = -100; // Offset to account for header
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        
        this.updateControls();
    }
    
    updateControls() {
        if (!this.controlsDiv) return;
        
        const prevBtn = this.controlsDiv.querySelector('.prev-btn');
        const nextBtn = this.controlsDiv.querySelector('.next-btn');
        const numbersDiv = this.controlsDiv.querySelector('.pagination-numbers');
        const infoSpan = this.controlsDiv.querySelector('.current-items');
        
        // Update buttons state
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
        
        // Update info
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.items.length);
        infoSpan.textContent = `Showing ${start}-${end} of ${this.items.length} items`;
        
        // Update page numbers
        numbersDiv.innerHTML = this.generatePageNumbers();
        
        // Add click listeners to page numbers
        numbersDiv.querySelectorAll('.pagination-number:not(.ellipsis)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.showPage(page);
            });
        });
    }
    
    generatePageNumbers() {
        let html = '';
        const maxVisible = 5;
        
        if (this.totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= this.totalPages; i++) {
                html += this.createPageButton(i);
            }
        } else {
            // Show first page
            html += this.createPageButton(1);
            
            let startPage = Math.max(2, this.currentPage - 1);
            let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
            
            // Adjust if at the beginning
            if (this.currentPage <= 3) {
                endPage = 4;
            }
            
            // Adjust if at the end
            if (this.currentPage >= this.totalPages - 2) {
                startPage = this.totalPages - 3;
            }
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
                html += '<span class="pagination-number ellipsis">...</span>';
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                html += this.createPageButton(i);
            }
            
            // Add ellipsis before last page if needed
            if (endPage < this.totalPages - 1) {
                html += '<span class="pagination-number ellipsis">...</span>';
            }
            
            // Show last page
            html += this.createPageButton(this.totalPages);
        }
        
        return html;
    }
    
    createPageButton(pageNumber) {
        const isActive = pageNumber === this.currentPage ? 'active' : '';
        return `<button class="pagination-number ${isActive}" data-page="${pageNumber}">${pageNumber}</button>`;
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.showPage(this.currentPage + 1);
        }
    }
    
    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.showPage(1);
    }
}

// Initialize pagination when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Projects pagination (3 items per page - 1 row x 3 columns)
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        new PaginationManager('projects-grid-paginated', 3);
    }
    
    // Certifications pagination (3 items per page - 1 row x 3 columns)
    const certificationsGrid = document.querySelector('.certifications-grid');
    if (certificationsGrid) {
        new PaginationManager('certifications-grid-paginated', 3);
    }
    
    // Publications pagination (3 items per page - 1 row x 3 columns)
    const publicationsGrid = document.querySelector('.publications-grid');
    if (publicationsGrid) {
        new PaginationManager('publications-grid-paginated', 3);
    }
});
