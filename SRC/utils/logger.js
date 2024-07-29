import winston from 'winston'

// Especifico los colores asociados a cada nivel de prioridad.
const customLevelColors = {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "cyan"
}

//Creo el logger

winston.addColors(customLevelColors)

const logger = winston.createLogger({
    
// Niveles de prioridad de logueo.
    levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5
    },
       
// Transportes posibles para mi logger
    transports: [

        // Logueará por consola los tipo 'debug'. Como es por consola, configuro para que salga a color
        new winston.transports.Console({
            level: 'debug', // Aclaración: Mensajes tipo 'debug' Y SUPERIORES saldrán por pantalla. (Osea: TODOS)
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple() // Un mensaje reducido
            )
        }),

        // Logueará en un archivo externo los tipo Error y Fatal.
        // No se ponen los colores ya que un archivo .log no tiene colores, es una cadena de strings.
        new winston.transports.File({
            level: 'error', // De error para arriba (error y fatal)
            filename: './Logs/errors.log',
            format: winston.format.simple()
        })
    ]
})

// Creo un middleware que configue el req.logger para todas las solicitudes.
const logger_middleware = (req, res, next) => {

    // Ahora, el logger queda disponible para ser utilizado en cualquier solicitud HTTP
    req.logger = logger
    next()
}

export {logger_middleware, logger}
