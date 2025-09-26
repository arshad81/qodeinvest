import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";

export default function Home() {
    const [articles, setArticles] = useState([]);

    const fetchQuotes = async () => {
        try {
            const res = await axios.get(API_ENDPOINTS.getQuotes);
            setArticles(res.data.data);
            console.log(res.data);
        } catch (err) {
            console.error("Error fetching articles:", err);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const formatDate = (isoDate) => {
        if (!isoDate) return "Unknown date";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">Home</h1>
            <p className="text-gray-600 mb-6">Latest Posts</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article,index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
                    >
                        <p className="text-sm text-gray-500">
                            {formatDate(article.published_at)}
                        </p>
                        <h2 className="text-lg font-semibold mt-2">{article.title}</h2>
                        <p className="text-gray-700 mt-2">{article.description}</p>
                        <a
                            href={article.url}
                            target="_blank"
                            className="text-blue-600 hover:underline mt-3 inline-block"
                        >
                            Read More →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
