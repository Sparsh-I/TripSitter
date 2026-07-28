import {useEffect} from "react";

interface EmbedWidgetProps {
    link: string | undefined;
}

export default function EmbedWidget({ link }: EmbedWidgetProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.airbnb.ca/embeddable/airbnb_jssdk";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    function extractAirbnbId(link: string): string | null {
        const match = link.match(/\/([^/?]+)\?/);
        return match ? match[1] : null;
    }
    if (!link) return <p>Missing embed link</p>;

    const airbnbId = extractAirbnbId(link);

    if (!airbnbId) return <p>Invalid Airbnb link</p>;

    return (
        <div
            className="airbnb-embed-frame embed-widget"
            data-id={airbnbId}
            data-view="home"
            data-hide-price="true"
        />
    );
}