// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Observe all containers
document.querySelectorAll('.container').forEach(el => observer.observe(el));

// Optional: Smooth scroll handling for any future anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Prepare visualization container
const visualizationContainer = document.querySelector('.visualization-container');

function showLoading(container) {
    container.classList.add('loading');
}

function hideLoading(container) {
    container.classList.remove('loading');
}

async function loadVisualization() {
    const container = document.querySelector('.visualization-container');
    
    try {
        showLoading(container);
        const response = await fetch('./data/DATA.html');
        let html = await response.text();
        
        // Remove all specific code lines
        const codeLinesToRemove = [
            /df_coffee\["Month"\] = df_coffee\["Tarih"\]\.dt\.month\n/g,
            /df_coffee\['Season'\] = df_coffee\['Month'\]\.apply\(get_season\)\n/g,
            /df_coffee\["Transaction_Date"\] = pd\.to_datetime\(df_coffee\["Tarih"\], format="%d\.%m\.%Y"\)\n/g,
            /df_coffee\["Jitter"\] = np\.random\.uniform\(0\.7, 1\.3, size=len\(df_coffee\)\)\n/g,
            /date = pd\.to_datetime\(date\)\n/g
        ];

        // Remove code lines
        codeLinesToRemove.forEach(line => {
            html = html.replace(line, '');
        });
        
        // Remove warning messages
        html = html.replace(/C:\\Users\\.*?ipykernel_\d+\\.*?py:\d+:.*?\n/g, '');
        html = html.replace(/UserWarning:.*?warning\.\n/g, '');
        html = html.replace(/SettingWithCopyWarning:.*?\n/g, '');
        html = html.replace(/A value is trying.*?\n/g, '');
        html = html.replace(/Try using.*?\n/g, '');
        html = html.replace(/See the caveats.*?\n/g, '');
        
        // Remove any paths
        html = html.replace(/C:\\Users\\.*?\n/g, '');
        
        // Clean up extra spaces and newlines
        html = html.replace(/\n\s*\n\s*\n/g, '\n');
        html = html.replace(/\s{2,}/g, ' ');
        
        const notebookContent = document.createElement('div');
        notebookContent.classList.add('notebook-content');
        notebookContent.innerHTML = html;
        
        container.innerHTML = '';
        container.appendChild(notebookContent);
        
        hideLoading(container);
    } catch (error) {
        console.error('Error loading notebook:', error);
        container.innerHTML = '<p class="error">Error loading visualization</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadVisualization); 