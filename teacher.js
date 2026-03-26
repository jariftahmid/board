const subjects = {
    bangla: { title: "Bangla Classes", videos: [{ title: "Bangla 1st Paper Introduction", id: "https://www.youtube.com/embed/dQw4w9WgXcQ" }, { title: "Bangla Grammar - Shondhi", id: "https://www.youtube.com/embed/30vHn7E7uS0" }] },
    english1: { title: "English 1st Paper", videos: [{ title: "Tense Mastery", id: "https://www.youtube.com/embed/847V_pS8iio" }] },
    math: { title: "Mathematics", videos: [{ title: "Algebra Basics", id: "https://www.youtube.com/embed/NybHck1Va0U" }] },
    physics: { title: "Physics", videos: [{ title: "Measurements", id: "https://www.youtube.com/embed/847V_pS8iio" }] },
    chemistry: { title: "Chemistry", videos: [] },
    biology: { title: "Biology", videos: [] },
    ict: { title: "ICT", videos: [] },
    bgs: { title: "BGS", videos: [] },
    english2: { title: "English 2nd Paper", videos: [] }
};

function showContent(subjectKey, btn) {
    const buttons = document.querySelectorAll('.sidebar button');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const subject = subjects[subjectKey];
    document.getElementById('subject-title').innerText = subject.title;
    const container = document.getElementById('video-container');
    container.innerHTML = "";

    if (subject.videos.length > 0) {
        subject.videos.forEach(video => {
            container.innerHTML += `
                <div class="video-card">
                    <iframe src="${video.id}" allowfullscreen title="${video.title}"></iframe>
                    <h3>${video.title}</h3>
                </div>
            `;
        });
    } else {
        container.innerHTML = "<p>New video content for this subject is coming soon. Stay tuned!</p>";
    }
}

window.onload = () => showContent('bangla', document.querySelector('.sidebar button'));