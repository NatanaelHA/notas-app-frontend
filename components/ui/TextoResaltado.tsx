interface TextoResaltadoProps {
  texto: string
  className?: string
  strongClassName?: string
}
  
  export default function TextoResaltado({ texto, className = '', strongClassName = '', }: TextoResaltadoProps) {
    const partes = texto.split(/\*\*(.*?)\*\*/g)
  
    return (
      <span className={className}>
        {partes.map((parte, i) =>
          i % 2 === 1 ? (
            <strong key={i} className={`font-semibold text-blue-600 dark:text-blue-400 ${strongClassName}`}>
              {parte}
            </strong>
          ) : (
            <span key={i}>{parte}</span>
          )
        )}
      </span>
    )
  }