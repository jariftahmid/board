document.addEventListener("DOMContentLoaded", () => {
    // বর্তমান ইউআরএল থেকে শুধু পেজের নামটুকু বের করা
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // সব লিংকের একটিভ ক্লাস আগে সরিয়ে ফেলা
        link.classList.remove('active');

        // ১. সরাসরি ফাইল নাম মিলে গেলে (যেমন question.html)
        if (page === href) {
            link.classList.add('active');
        } 
        // ২. যদি হোম পেজে থাকেন (খালি পাথ বা index.html)
        else if ((page === "" || page === "index.html") && href === "index.html") {
            link.classList.add('active');
        }
    });
});