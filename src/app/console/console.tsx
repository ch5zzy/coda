import "./console.css";

export default function Console(props: {
    text: string
}) {
    return <pre className="console">{props.text}</pre>;
}