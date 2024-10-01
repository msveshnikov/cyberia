import { useEffect } from 'react';

function Landing() {
    useEffect(() => {
        fetch('/landing.html')
            .then((response) => response.text())
            .then((html) => {
                document.getElementById('landing-container').innerHTML = html;
            });
    }, []);

    return <div id="landing-container"></div>;
}

export default Landing;
