document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/getData');
        const data = await response.text();

        document.getElementById('data-container').innerHTML = data;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('data-container').innerHTML = 'Error fetching data.';
    }
}
