'use client'
import { useState, useEffect, useRef } from "react";
import { Anton, Roboto_Mono } from "next/font/google";
import confetti from "canvas-confetti";
import { Download, MessageCircle, Instagram, Link, RefreshCw, X, Trophy, Info, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const anton = Anton({ subsets: ["latin"], weight: "400" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: "400" });

const respuestasRicachon = [
  "Qué talento el tuyo para gastar sin pestañear… algunos nacen con el don de la felicidad líquida.",
  "Increíble cómo tu billetera nunca dice 'no'… debería tener su propio club de fans.",
  "Verte comprar cualquier cosa a gusto me recuerda que algunos nacen para la abundancia.",
  "Tu capacidad de gastar es casi poética… los demás solo aplaudimos desde la tribuna.",
  "Es admirable cómo convertís el dinero en sonrisas… lástima que la mayoría solo hacen cuentas.",
  "Qué lindo es ver a alguien comprar sin culpa… algunos necesitan meditación, vos solo tu tarjeta.",
  "Verte elegir lo más caro es como ver arte moderno: nadie entiende cómo funciona, pero impresiona.",
  "Tu dinero trabaja más que muchos de nosotros… y encima lo disfruta más.",
  "Es fascinante cómo tu bolsillo tiene siempre plan de acción… los demás siguen soñando con descuentos.",
  "Gastar sin miedo debería ser deporte olímpico… vos claramente ya ganaste el oro.",
];

const respuestasPobreton = [
  "No deberías… pero mirá cómo todo te sale perfecto, casi injusto.",
  "Gastar así es un riesgo… pero vos parecés tener la suerte programada.",
  "Esto no estaba en el presupuesto… y aun así lo estás haciendo parecer un arte.",
  "No es recomendable… pero claramente ignorás las reglas y ganás igual.",
  "Si alguien más hiciera esto, sería un desastre… vos lo convertís en espectáculo.",
  "No tendrías que, pero mirá vos… todo sale tan bien que duele un poco la envidia.",
  "El manual dice que no se hace… pero vos sos la excepción que lo confirma.",
  "No es prudente… y sin embargo, lo hacés con estilo y sin despeinarte.",
  "Debería alarmarme… pero todo lo que hacés parece tener un plan secreto que funciona.",
  "No era la idea… pero vos la transformaste en la mejor idea que nadie esperaba.",
];

const respuestasIndigente = [
  "Mirá vos… gastando como millonario con bolsillo de cartón, impresionante ambición.",
  "No tendrías que… pero al menos la ilusión te queda perfecta.",
  "Tu cuenta bancaria llora, pero tu autoestima aplaude.",
  "Es hermoso verte intentar vivir en el mundo de los ricos… aunque sea por cinco minutos.",
  "Tu tarjeta dice 'no', pero tu corazón dice 'sí'… y eso ya es un logro.",
  "Debería preocuparte… pero tu alegría es tan grande que casi convence a todos.",
  "Gastando más de lo que tenés… ¡vaya forma de practicar el optimismo extremo!",
  "El presupuesto grita… pero la ilusión canta, y eso también vale.",
  "No podés, no deberías… y sin embargo, aquí estás, viviendo tu sueño barato con estilo.",
  "No es sostenible… pero nadie puede decir que no lo hacés con entusiasmo.",
];

const cardPorEstado: Record<string, string> = {
  Ricachon: "/card_ricachon.png",
  Pobreton: "/card_pobreton.png",
  Indigente: "/card_indigente.png",
};

const tooltipPorEstado: Record<string, string> = {
  Ricachon: "💰 Este mes sobra plata y también actitud.",
  Pobreton: "😬 Alcanza justo… pero el gastito igual va.",
  Indigente: "💀 La billetera llora, pero el corazón manda.",
};

const sugerencias = [
  "Un café de especialidad ☕",
  "Sushi a domicilio 🍣",
  "Ropa que no necesito 👗",
  "Una planta nueva 🪴",
  "Entrada al cine 🎬",
  "Helado artesanal 🍦",
  "Libro que nunca voy a leer 📚",
  "Perfume caro 🌸",
  "Zapatillas nuevas 👟",
  "Una salida con amigos 🍻",
];

const placeholdersMonto = [
  "ej: 12000",
  "no mientas…",
  "¿cuánto en serio?",
  "ponele un número",
  "dale, confesá",
];

const imagenes = ["ricachon", "pobreton", "indigente"];

const opcionesPaso1 = [
  { id: "Ricachon", label: "💰 Ricachón" },
  { id: "Pobreton", label: "😬 Pobretón" },
  { id: "Indigente", label: "💀 Indigente" },
];

const mensajesPorHora = () => {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 12) return "🌅 Buenos días… ¿ya estás pensando en gastar?";
  if (hora >= 12 && hora < 18) return "☀️ Buenas tardes… el gastito de hoy no se lo niega nadie.";
  if (hora >= 18 && hora < 22) return "🌆 Buenas noches… fin del día, hora del gastito.";
  return "🌙 Tan tarde y pensando en gastar… respeto total.";
};

const frasePorTotal = (total: number) => {
  if (total === 0) return "";
  if (total < 20000) return "Tranqui… todavía no la chocaste. 😌";
  if (total < 80000) return "Vas bien… para la ruina. 😬";
  if (total < 150000) return "Esto ya no es un gastito, es un estilo de vida. 💸";
  return "Tu billetera pidió asilo político. 💀";
};

// Convierte string con puntos a número
const parseMonto = (valor: string): number => {
  return Number(valor.replace(/\./g, "").replace(",", ".")) || 0;
};

// Formatea número como moneda argentina
const formatMonto = (valor: number): string => {
  return valor.toLocaleString("es-AR");
};

const labelsPaso = ["Estado", "Gastito", "Monto", "Resultado"];

const botonesVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const botonVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const LOGROS = [
  { id: "primer_gastito", emoji: "🏆", titulo: "Primer gastito", descripcion: "Completaste tu primer gastito del mes.", condicion: (c: number, _v: Record<string, number>) => c === 1 },
  { id: "gastador_serial", emoji: "🔥", titulo: "Gastador serial", descripcion: "Ya van 5 gastitos. No hay quien te pare.", condicion: (c: number, _v: Record<string, number>) => c === 5 },
  { id: "sin_retorno", emoji: "💀", titulo: "Sin retorno financiero", descripcion: "10 gastitos. La billetera ya no sabe qué hacer.", condicion: (c: number, _v: Record<string, number>) => c === 10 },
  { id: "rey_gastito", emoji: "👑", titulo: "Rey/Reina del gastito", descripcion: "Elegiste Ricachón 3 veces. La abundancia te eligió.", condicion: (_c: number, v: Record<string, number>) => v.Ricachon >= 3 },
  { id: "pobreton_comprometido", emoji: "😬", titulo: "Pobretón comprometido", descripcion: "Elegiste Pobretón 3 veces. El riesgo es tu idioma.", condicion: (_c: number, v: Record<string, number>) => v.Pobreton >= 3 },
  { id: "indigente_actitud", emoji: "🪦", titulo: "Indigente con actitud", descripcion: "Elegiste Indigente 3 veces. La ilusión no se rinde.", condicion: (_c: number, v: Record<string, number>) => v.Indigente >= 3 },
];

const PALETA = {
  azulClaro: "#5ab0d4",
  azulMedio: "#3d8fc4",
  azulNavy: "#0f2d4a",
  azulOscuro: "#1a3a4a",
};

export default function Home() {
  const [paso, setPaso] = useState(1);
  const [estadoFinanciero, setEstadoFinanciero] = useState("");
  const [gastito, setGastito] = useState("");
  const [monto, setMonto] = useState("");
  const [montoNum, setMontoNum] = useState(0);
  const [respuestaFinal, setRespuestaFinal] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [imgActual, setImgActual] = useState("ricachon");
  const [girando, setGirando] = useState(false);
  const [contador, setContador] = useState(0);
  const [monedas, setMonedas] = useState<{ id: number; x: number; delay: number }[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState("");
  const [votos, setVotos] = useState({ Ricachon: 0, Pobreton: 0, Indigente: 0 });
  const [sugerenciaActual, setSugerenciaActual] = useState("");
  const [splash, setSplash] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<string[]>([]);
  const [logroNuevo, setLogroNuevo] = useState<typeof LOGROS[0] | null>(null);
  const [modalLogrosAbierto, setModalLogrosAbierto] = useState(false);
  const [totalMes, setTotalMes] = useState(0);
  const [placeholderMonto] = useState(placeholdersMonto[Math.floor(Math.random() * placeholdersMonto.length)]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputGastitoRef = useRef<HTMLInputElement>(null);
  const inputMontoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (paso === 2) setTimeout(() => inputGastitoRef.current?.focus(), 400);
    if (paso === 3) setTimeout(() => inputMontoRef.current?.focus(), 400);
  }, [paso]);

  useEffect(() => {
    const guardado = parseInt(localStorage.getItem("migastitoContador") || "0");
    setContador(guardado);
    const votosGuardados = JSON.parse(localStorage.getItem("migastitoVotos") || '{"Ricachon":0,"Pobreton":0,"Indigente":0}');
    setVotos(votosGuardados);
    const logrosGuardados = JSON.parse(localStorage.getItem("migastitoLogros") || '[]');
    setLogrosDesbloqueados(logrosGuardados);
    const nuevasMonedas = Array.from({ length: 8 }, (_, i) => ({
      id: i, x: Math.random() * 90 + 5, delay: Math.random() * 3,
    }));
    setMonedas(nuevasMonedas);
    setSugerenciaActual(sugerencias[Math.floor(Math.random() * sugerencias.length)]);
    const mesActual = new Date().getMonth();
    const gastosData = JSON.parse(localStorage.getItem("migastitoData") || '{"mes": -1, "gastos": []}');
    if (gastosData.mes !== mesActual) {
      localStorage.setItem("migastitoData", JSON.stringify({ mes: mesActual, gastos: [] }));
      setTotalMes(0);
    } else {
      const total = gastosData.gastos.reduce((acc: number, item: { monto: number }) => acc + item.monto, 0);
      setTotalMes(total);
    }
  }, []);

  const cambiarPaso = (nuevoPaso: number, accion: () => void) => {
    setTimeout(() => { accion(); setPaso(nuevoPaso); }, 300);
  };

  const seleccionarEstado = (estado: string) => {
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    setGirando(true);
    setEstadoFinanciero(estado);
    let count = 0;
    intervalRef.current = setInterval(() => {
      setImgActual(imagenes[Math.floor(Math.random() * imagenes.length)]);
      count++;
      if (count >= 12) {
        clearInterval(intervalRef.current!);
        setImgActual(estado.toLowerCase());
        setGirando(false);
        setTimeout(() => cambiarPaso(2, () => {}), 600);
      }
    }, 150);
  };

  const confirmarGastito = () => {
    if (gastito.trim() === "") return;
    cambiarPaso(3, () => {});
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permite números y puntos
    const valor = e.target.value.replace(/[^0-9.]/g, "");
    setMonto(valor);
  };

  const confirmarMonto = () => {
    const montoNumerico = parseMonto(monto);
    let respuestas: string[] = [];
    if (estadoFinanciero === "Ricachon") respuestas = respuestasRicachon;
    if (estadoFinanciero === "Pobreton") respuestas = respuestasPobreton;
    if (estadoFinanciero === "Indigente") respuestas = respuestasIndigente;
    const base = respuestas[Math.floor(Math.random() * respuestas.length)];
    const respuesta = `¿${gastito}? ${base}`;

    setMontoNum(montoNumerico);

    if (montoNumerico > 0) {
      const mesActual = new Date().getMonth();
      const gastosData = JSON.parse(localStorage.getItem("migastitoData") || `{"mes": ${mesActual}, "gastos": []}`);
      const nuevoHistorial = [...gastosData.gastos, { monto: montoNumerico, gastito, fecha: new Date().toISOString() }];
      localStorage.setItem("migastitoData", JSON.stringify({ mes: mesActual, gastos: nuevoHistorial }));
      setTotalMes(nuevoHistorial.reduce((acc: number, item: { monto: number }) => acc + item.monto, 0));
    }

    const nuevoContador = parseInt(localStorage.getItem("migastitoContador") || "0") + 1;
    localStorage.setItem("migastitoContador", nuevoContador.toString());
    setContador(nuevoContador);

    const nuevosVotos = { ...votos, [estadoFinanciero]: votos[estadoFinanciero as keyof typeof votos] + 1 };
    localStorage.setItem("migastitoVotos", JSON.stringify(nuevosVotos));
    setVotos(nuevosVotos);

    const logrosActuales: string[] = JSON.parse(localStorage.getItem("migastitoLogros") || '[]');
    for (const logro of LOGROS) {
      if (!logrosActuales.includes(logro.id) && logro.condicion(nuevoContador, nuevosVotos)) {
        const actualizados = [...logrosActuales, logro.id];
        localStorage.setItem("migastitoLogros", JSON.stringify(actualizados));
        setLogrosDesbloqueados(actualizados);
        setTimeout(() => { setLogroNuevo(logro); confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } }); }, 1000);
        break;
      }
    }
    cambiarPaso(4, () => setRespuestaFinal(respuesta));
  };

  useEffect(() => {
    if (paso === 4) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }, [paso]);

  const descargarCard = () => {
    const link = document.createElement("a");
    link.href = cardPorEstado[estadoFinanciero];
    link.download = `card_${estadoFinanciero.toLowerCase()}.png`;
    link.click();
  };

  const compartirWhatsApp = () => {
    const url = "https://migastito.vercel.app";
    const texto = montoNum > 0
      ? `Este mes ya quemé $${formatMonto(montoNum)} en ${gastito} 💀 ¿y vos? ${url}`
      : `¡Mirá mi gastito del mes! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const compartirInstagram = () => { descargarCard(); alert("Guardá la imagen y subila a tus historias 😎"); };
  const copiarLink = () => { navigator.clipboard.writeText("https://migastito.vercel.app"); alert("¡Link copiado!"); };

  const volverEmpezar = () => {
    cambiarPaso(1, () => {
      setEstadoFinanciero(""); setGastito(""); setMonto(""); setMontoNum(0); setRespuestaFinal("");
      setImgActual("ricachon");
      setSugerenciaActual(sugerencias[Math.floor(Math.random() * sugerencias.length)]);
    });
  };

  const totalVotos = votos.Ricachon + votos.Pobreton + votos.Indigente || 1;
  const bg = modoOscuro ? "#0a1628" : `linear-gradient(160deg, ${PALETA.azulClaro} 0%, ${PALETA.azulMedio} 100%)`;
  const color = modoOscuro ? "#e0f4ff" : PALETA.azulNavy;
  const cardBg = modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.25)";
  const cardBorder = modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)";
  const porcentajePaso = paso === 1 ? 25 : paso === 2 ? 50 : paso === 3 ? 75 : 100;

  const inputStyle: React.CSSProperties = {
    padding: "14px 16px", fontSize: "clamp(13px, 2vw, 15px)", width: "100%",
    borderRadius: "12px", border: `2px solid ${modoOscuro ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)"}`,
    color: color, backgroundColor: modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.4)",
    boxSizing: "border-box" as const, fontFamily: robotoMono.style.fontFamily, outline: "none",
    backdropFilter: "blur(8px)",
  };

  const btnCompartirStyle = (bgColor: string): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "8px", padding: "14px 20px",
    borderRadius: "14px", backgroundColor: bgColor, color: "white", border: "none",
    cursor: "pointer", fontFamily: robotoMono.style.fontFamily,
    fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)", fontWeight: "bold", letterSpacing: "1px",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  });

  if (splash) {
    return (
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: `linear-gradient(160deg, ${PALETA.azulClaro} 0%, ${PALETA.azulMedio} 100%)`, width: "100%", textAlign: "center", padding: "0 16px", boxSizing: "border-box" }}>
        <motion.img src="/grupal.png" alt="Personajes" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ width: "clamp(150px, 40vw, 260px)", objectFit: "contain" }} />
        <motion.img src="/Logo_MiGastito.png" alt="Mi Gastito" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ width: "clamp(200px, 50vw, 320px)", objectFit: "contain", marginTop: "8px" }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: "20px", fontSize: "clamp(0.8rem, 2vw, 1rem)", color: PALETA.azulNavy, opacity: 0.7, fontFamily: robotoMono.style.fontFamily }}>
          Cargando tu gastito del mes…
        </motion.p>
      </main>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: bg, color: color, transition: "all 0.3s ease", fontFamily: robotoMono.style.fontFamily, width: "100%", boxSizing: "border-box" }}>

      {paso === 1 && monedas.map((m) => (
        <div key={m.id} style={{ position: "fixed", left: `${m.x}%`, top: "-40px", fontSize: "1.5rem", animation: `caer 4s ${m.delay}s infinite linear`, pointerEvents: "none", zIndex: 0 }}>💰</div>
      ))}

      <style>{`
        @keyframes caer { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0.3; } }
        .tooltip-box { position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; white-space: nowrap; pointer-events: none; z-index: 99; }
        .btn-opcion:hover { transform: scale(1.08) !important; box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important; }
        .btn-opcion:active { transform: scale(0.96) !important; }
        .btn-compartir:hover { transform: scale(1.05) !important; box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important; }
        .btn-compartir:active { transform: scale(0.97) !important; }
        input::placeholder { color: rgba(15,45,74,0.5); }
      `}</style>

      {/* Modal logro */}
      <AnimatePresence>
        {logroNuevo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLogroNuevo(null)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ duration: 0.3 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ background: `linear-gradient(135deg, ${PALETA.azulNavy}, ${PALETA.azulMedio})`, color: "white", borderRadius: "24px", padding: "36px", maxWidth: "360px", width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.4)", border: "2px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "8px" }}>{logroNuevo.emoji}</div>
              <p style={{ fontSize: "0.75rem", opacity: 0.7, letterSpacing: "3px", marginBottom: "8px" }}>LOGRO DESBLOQUEADO</p>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "1.8rem", letterSpacing: "1px", marginBottom: "12px" }}>{logroNuevo.titulo.toUpperCase()}</h2>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.85, marginBottom: "24px" }}>{logroNuevo.descripcion}</p>
              <button onClick={() => setLogroNuevo(null)}
                style={{ backgroundColor: "white", color: PALETA.azulNavy, border: "none", borderRadius: "12px", padding: "14px 24px", width: "100%", fontFamily: robotoMono.style.fontFamily, fontWeight: "bold", fontSize: "1rem", cursor: "pointer", letterSpacing: "1px" }}>
                ¡LO MEREZCO! 💪
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal logros */}
      <AnimatePresence>
        {modalLogrosAbierto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalLogrosAbierto(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ backgroundColor: modoOscuro ? "rgba(10,22,40,0.97)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", color: color, borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)", position: "relative", border: `1px solid ${cardBorder}` }}>
              <button onClick={() => setModalLogrosAbierto(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: color }}><X size={20} /></button>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "clamp(1.2rem, 4vw, 1.8rem)", marginBottom: "20px", letterSpacing: "1px" }}>🏆 MIS LOGROS</h2>
              {LOGROS.map((logro) => {
                const desbloqueado = logrosDesbloqueados.includes(logro.id);
                return (
                  <div key={logro.id} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", opacity: desbloqueado ? 1 : 0.3 }}>
                    <span style={{ fontSize: "1.8rem" }}>{desbloqueado ? logro.emoji : "🔒"}</span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontWeight: "bold", fontSize: "0.9rem", margin: 0 }}>{logro.titulo}</p>
                      <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: 0 }}>{logro.descripcion}</p>
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize: "0.75rem", opacity: 0.4, marginTop: "16px" }}>{logrosDesbloqueados.length}/{LOGROS.length} logros desbloqueados</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal info */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAbierto(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ backgroundColor: modoOscuro ? "rgba(10,22,40,0.97)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", color: color, borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)", position: "relative", border: `1px solid ${cardBorder}` }}>
              <button onClick={() => setModalAbierto(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: color }}><X size={20} /></button>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "clamp(1.2rem, 4vw, 1.8rem)", marginBottom: "16px", letterSpacing: "1px" }}>💸 ¿QUÉ ES MI GASTITO?</h2>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>Es una app para celebrar tus decisiones financieras sin culpa. Sabemos que a veces la billetera no acompaña… pero el gastito igual va.</p>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}><strong>¿Cómo funciona?</strong></p>
              <p style={{ marginBottom: "8px", lineHeight: 1.7 }}>💰 <strong>Ricachón</strong> — Este mes sobra plata y también actitud.</p>
              <p style={{ marginBottom: "8px", lineHeight: 1.7 }}>😬 <strong>Pobretón</strong> — Alcanza justo… pero el gastito igual va.</p>
              <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>💀 <strong>Indigente</strong> — La billetera llora, pero el corazón manda.</p>
              <p style={{ lineHeight: 1.7, opacity: 0.6, fontSize: "0.9rem" }}>Elegís tu estado, escribís tu gastito, confirmás cuánto vas a gastar y recibís una respuesta empática. ¡Sin juicios!</p>
              <button onClick={() => setModalAbierto(false)}
                style={{ marginTop: "20px", backgroundColor: PALETA.azulNavy, color: "white", border: "none", borderRadius: "12px", padding: "14px 24px", width: "100%", fontFamily: robotoMono.style.fontFamily, fontWeight: "bold", fontSize: "1rem", cursor: "pointer", letterSpacing: "1px" }}>
                ¡ENTENDIDO, VAMOS! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: PALETA.azulNavy, boxShadow: "0 2px 20px rgba(0,0,0,0.3)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", minHeight: "72px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "100px" }}>
          <span style={{ fontSize: "clamp(0.7rem, 1.6vw, 0.85rem)", fontFamily: robotoMono.style.fontFamily, color: "rgba(255,255,255,0.6)" }}>
            🧾 {contador} gastitos
          </span>
          {totalMes > 0 && (
            <span style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)", fontFamily: robotoMono.style.fontFamily, fontWeight: "bold", color: PALETA.azulClaro }}>
              💸 ${formatMonto(totalMes)}
            </span>
          )}
        </div>
        <img src="/Logo_MiGastito.png" alt="Mi Gastito" style={{ height: "clamp(40px, 6vw, 56px)", objectFit: "contain", position: "absolute", left: "50%", transform: "translateX(-50%)" }} />
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button onClick={() => setModalLogrosAbierto(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: "6px", fontSize: "clamp(0.7rem, 1.6vw, 0.85rem)", fontFamily: robotoMono.style.fontFamily, padding: "8px 12px", borderRadius: "10px" }}>
            <Trophy size={16} /> {logrosDesbloqueados.length}/{LOGROS.length}
          </button>
          <button onClick={() => setModalAbierto(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", padding: "8px", borderRadius: "10px", display: "flex", alignItems: "center" }}>
            <Info size={18} />
          </button>
          <button onClick={() => setModoOscuro(!modoOscuro)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", padding: "8px", borderRadius: "10px", display: "flex", alignItems: "center" }}>
            {modoOscuro ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "90px 20px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ zIndex: 1, textAlign: "center", width: "100%", marginBottom: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/grupal.png" alt="Personajes" style={{ width: "clamp(160px, 40vw, 280px)", objectFit: "contain", display: "block", margin: "0 auto" }} />
          <h1 style={{ fontSize: "clamp(1.8rem, 6vw, 4rem)", margin: 0, fontFamily: anton.style.fontFamily, letterSpacing: "clamp(2px, 0.5vw, 4px)", lineHeight: 1.1, color: modoOscuro ? "white" : PALETA.azulNavy }}>
            MI GASTITO
          </h1>
        </motion.div>

        <p style={{ fontSize: "clamp(0.75rem, 2vw, 0.95rem)", marginBottom: "12px", opacity: 0.7, zIndex: 1, fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px", textAlign: "center", width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
          {mensajesPorHora()}
        </p>

        <div style={{ width: "100%", maxWidth: "600px", marginBottom: "28px", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            {labelsPaso.map((label, i) => (
              <span key={label} style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.75rem)", fontFamily: robotoMono.style.fontFamily, opacity: paso === i + 1 ? 1 : 0.4, fontWeight: paso === i + 1 ? "bold" : "normal", color: paso === i + 1 ? (modoOscuro ? "white" : PALETA.azulNavy) : undefined, transition: "all 0.3s ease" }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{ width: "100%", height: "10px", backgroundColor: modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", borderRadius: "999px" }}>
            <motion.div animate={{ width: `${porcentajePaso}%` }} transition={{ duration: 0.4 }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${PALETA.azulNavy}, ${PALETA.azulMedio})`, borderRadius: "999px" }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={paso} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}
            style={{ width: "100%", maxWidth: "600px", zIndex: 1, textAlign: "center" }}>

            {/* PASO 1 */}
            {paso === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "24px", padding: "clamp(20px, 4vw, 36px)", width: "100%", boxSizing: "border-box", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)", marginBottom: "24px", letterSpacing: "1px", fontWeight: "bold", color: modoOscuro ? "white" : PALETA.azulNavy }}>
                  ¿QUÉ TAN ROTO ESTÁS ESTE MES? 💀
                </p>
                {girando ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <motion.img key={imgActual} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={`/${imgActual}.png`} alt="girando"
                      style={{ width: "clamp(100px, 25vw, 160px)", height: "clamp(100px, 25vw, 160px)", objectFit: "contain" }} />
                    <p style={{ fontSize: "0.9rem", letterSpacing: "2px", opacity: 0.7 }}>ANALIZANDO TU BILLETERA…</p>
                  </div>
                ) : (
                  <motion.div variants={botonesVariants} initial="hidden" animate="show"
                    style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", marginBottom: "24px" }}>
                    {opcionesPaso1.map(({ id, label }) => (
                      <motion.div key={id} variants={botonVariant}
                        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
                        onMouseEnter={() => setTooltipVisible(id)} onMouseLeave={() => setTooltipVisible("")}>
                        {tooltipVisible === id && <div className="tooltip-box">{tooltipPorEstado[id]}</div>}
                        <img src={`/${id.toLowerCase()}.png`} alt={label} style={{ width: "clamp(80px, 15vw, 120px)", height: "clamp(80px, 15vw, 120px)", objectFit: "contain" }} />
                        <button className="btn-opcion" onClick={() => seleccionarEstado(id)}
                          style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)", padding: "14px clamp(16px, 3vw, 28px)", border: `2px solid ${modoOscuro ? "rgba(255,255,255,0.3)" : PALETA.azulNavy}`, color: modoOscuro ? "white" : PALETA.azulNavy, backgroundColor: modoOscuro ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.4)", fontWeight: "bold", borderRadius: "14px", cursor: "pointer", transition: "transform 0.15s ease, box-shadow 0.15s ease", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px", backdropFilter: "blur(8px)" }}>
                          {label}
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {totalVotos > 1 && (
                  <div style={{ marginBottom: "20px", fontSize: "0.75rem", opacity: 0.6 }}>
                    {opcionesPaso1.map(({ id, label }) => (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", justifyContent: "center" }}>
                        <span style={{ width: "100px", textAlign: "right" }}>{label}</span>
                        <div style={{ width: "120px", height: "5px", backgroundColor: modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", borderRadius: "999px" }}>
                          <motion.div animate={{ width: `${Math.round((votos[id as keyof typeof votos] / totalVotos) * 100)}%` }} transition={{ duration: 0.4 }}
                            style={{ height: "100%", background: `linear-gradient(90deg, ${PALETA.azulNavy}, ${PALETA.azulMedio})`, borderRadius: "999px" }} />
                        </div>
                        <span>{Math.round((votos[id as keyof typeof votos] / totalVotos) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => seleccionarEstado(opcionesPaso1[Math.floor(Math.random() * 3)].id)}
                  style={{ backgroundColor: PALETA.azulNavy, color: "white", border: "none", borderRadius: "14px", padding: "16px 24px", width: "100%", fontFamily: robotoMono.style.fontFamily, letterSpacing: "2px", fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: "bold", cursor: "pointer" }}>
                  🎰 QUE DECIDA EL DESTINO
                </button>
              </motion.div>
            )}

            {/* PASO 2 */}
            {paso === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "24px", padding: "clamp(20px, 4vw, 36px)", width: "100%", boxSizing: "border-box", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 1.8rem)", fontFamily: anton.style.fontFamily, letterSpacing: "2px", textAlign: "center", margin: 0, color: modoOscuro ? "white" : PALETA.azulNavy }}>
                  ¿QUÉ GASTITO TE QUERÉS DAR?
                </h2>
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  src={`/${estadoFinanciero.toLowerCase()}.png`} alt={estadoFinanciero}
                  style={{ width: "clamp(120px, 30vw, 180px)", height: "clamp(120px, 30vw, 180px)", objectFit: "contain" }} />
                <div style={{ width: "100%", maxWidth: "320px", textAlign: "left" }}>
                  <label style={{ fontSize: "0.75rem", opacity: 0.6, fontFamily: robotoMono.style.fontFamily, display: "block", marginBottom: "6px", letterSpacing: "1px" }}>¿EN QUÉ VAS A GASTAR?</label>
                  <input ref={inputGastitoRef} type="text" placeholder={sugerenciaActual} value={gastito}
                    onChange={(e) => setGastito(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmarGastito()}
                    aria-label="Escribí tu gastito" style={inputStyle} />
                </div>
                <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: 0 }}>
                  💡 <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setGastito(sugerenciaActual)}>{sugerenciaActual}</span>
                </p>
                <button onClick={confirmarGastito}
                  style={{ backgroundColor: PALETA.azulNavy, color: "white", border: "none", borderRadius: "14px", padding: "16px 32px", fontFamily: robotoMono.style.fontFamily, letterSpacing: "2px", fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: "bold", cursor: "pointer" }}>
                  SIGUIENTE →
                </button>
              </motion.div>
            )}

            {/* PASO 3 */}
            {paso === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: "24px", padding: "clamp(20px, 4vw, 36px)", width: "100%", boxSizing: "border-box", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 1.8rem)", fontFamily: anton.style.fontFamily, letterSpacing: "2px", textAlign: "center", margin: 0, color: modoOscuro ? "white" : PALETA.azulNavy }}>
                  ¿CUÁNTO PENSÁS GASTAR?
                </h2>
                <p style={{ fontSize: "0.85rem", opacity: 0.6, margin: 0 }}>en <strong>{gastito}</strong></p>
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  src={`/${estadoFinanciero.toLowerCase()}.png`} alt={estadoFinanciero}
                  style={{ width: "clamp(100px, 25vw, 160px)", height: "clamp(100px, 25vw, 160px)", objectFit: "contain" }} />
                <div style={{ width: "100%", maxWidth: "320px", textAlign: "left" }}>
                  <label style={{ fontSize: "0.75rem", opacity: 0.6, fontFamily: robotoMono.style.fontFamily, display: "block", marginBottom: "6px", letterSpacing: "1px" }}>MONTO EN PESOS</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontWeight: "bold", fontSize: "18px", color: color, opacity: 0.7 }}>$</span>
                    <input ref={inputMontoRef} type="text" placeholder={placeholderMonto} value={monto}
                      onChange={handleMontoChange}
                      onKeyDown={(e) => e.key === "Enter" && confirmarMonto()}
                      aria-label="Cuánto pensás gastar"
                      style={{ ...inputStyle, paddingLeft: "32px" }} />
                  </div>
                  {monto && parseMonto(monto) > 0 && (
                    <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "6px", fontFamily: robotoMono.style.fontFamily }}>
                      = ${formatMonto(parseMonto(monto))}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={confirmarMonto}
                    style={{ backgroundColor: PALETA.azulNavy, color: "white", border: "none", borderRadius: "14px", padding: "16px 28px", fontFamily: robotoMono.style.fontFamily, letterSpacing: "2px", fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: "bold", cursor: "pointer" }}>
                    CONFIRMAR 💸
                  </button>
                  <button onClick={() => { setMonto("0"); confirmarMonto(); }}
                    style={{ backgroundColor: "transparent", color: color, border: `2px solid ${modoOscuro ? "rgba(255,255,255,0.3)" : PALETA.azulNavy}`, borderRadius: "14px", padding: "16px 24px", fontFamily: robotoMono.style.fontFamily, letterSpacing: "2px", fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: "bold", cursor: "pointer" }}>
                    SALTEAR
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 4 */}
            {paso === 4 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "0 8px", boxSizing: "border-box" }}>

                {montoNum > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.8, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}
                    style={{ background: `linear-gradient(135deg, ${PALETA.azulNavy}, ${PALETA.azulMedio})`, borderRadius: "20px", padding: "24px 32px", textAlign: "center", width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontFamily: robotoMono.style.fontFamily, letterSpacing: "3px", margin: "0 0 4px 0" }}>
                      GASTÉ EN {gastito.toUpperCase()}
                    </p>
                    <p style={{ fontSize: "clamp(2.5rem, 9vw, 4.5rem)", fontFamily: anton.style.fontFamily, color: "white", margin: 0, letterSpacing: "2px" }}>
                      ${formatMonto(montoNum)}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontFamily: robotoMono.style.fontFamily, margin: "10px 0 0 0" }}>
                      {frasePorTotal(totalMes)}
                    </p>
                  </motion.div>
                )}

                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontFamily: anton.style.fontFamily, letterSpacing: "3px", textAlign: "center", margin: 0, color: modoOscuro ? "white" : PALETA.azulNavy }}>
                  {gastito.toUpperCase()}
                </motion.h2>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                  style={{ backgroundColor: cardBg, borderRadius: "16px", padding: "20px 24px", width: "100%", backdropFilter: "blur(12px)", border: `1px solid ${cardBorder}`, borderLeft: `4px solid ${PALETA.azulNavy}` }}>
                  <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", fontStyle: "italic", lineHeight: 1.8, textAlign: "left", margin: 0 }}>
                    {respuestaFinal}
                  </p>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}
                  style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: "bold", textAlign: "center", margin: 0, color: modoOscuro ? "white" : PALETA.azulNavy }}>
                  ¿Y vos? Probalo 👇
                </motion.p>

                <p style={{ fontSize: "0.75rem", opacity: 0.5, fontFamily: robotoMono.style.fontFamily, margin: 0 }}>
                  🔥 Ya somos {contador} personas gastando sin culpa
                </p>

                <motion.img src={cardPorEstado[estadoFinanciero]} alt="Mi gastito"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.04 }}
                  style={{ width: "clamp(240px, 80vw, 380px)", borderRadius: "20px", boxShadow: "0 12px 40px rgba(0,0,0,0.3)", cursor: "pointer", border: `3px solid ${PALETA.azulNavy}` }} />

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                  <button className="btn-compartir" onClick={descargarCard} style={btnCompartirStyle(PALETA.azulNavy)}>
                    <Download size={18} /> DESCARGAR
                  </button>
                  <button className="btn-compartir" onClick={compartirWhatsApp} style={btnCompartirStyle("#25D366")}>
                    <MessageCircle size={18} /> WHATSAPP
                  </button>
                  <button className="btn-compartir" onClick={compartirInstagram} style={btnCompartirStyle("#E1306C")}>
                    <Instagram size={18} /> INSTAGRAM
                  </button>
                  <button className="btn-compartir" onClick={copiarLink} style={btnCompartirStyle(PALETA.azulMedio)}>
                    <Link size={18} /> COPIAR LINK
                  </button>
                </div>

                <button onClick={volverEmpezar}
                  style={{ backgroundColor: "transparent", color: modoOscuro ? "white" : PALETA.azulNavy, border: `2px solid ${modoOscuro ? "rgba(255,255,255,0.3)" : PALETA.azulNavy}`, borderRadius: "14px", padding: "14px 28px", fontFamily: robotoMono.style.fontFamily, letterSpacing: "2px", fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <RefreshCw size={16} /> VOLVER A EMPEZAR
                </button>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{ padding: "24px", textAlign: "center", fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)", color: modoOscuro ? "rgba(255,255,255,0.4)" : PALETA.azulNavy, opacity: 0.6, borderTop: `1px solid ${modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)"}`, fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
        <p style={{ marginBottom: "8px" }}>
          HECHO POR <a href="https://instagram.com/EnemigoMutante" target="_blank" rel="noopener noreferrer" style={{ color: modoOscuro ? PALETA.azulClaro : PALETA.azulNavy, textDecoration: "none", fontWeight: "bold" }}>@ENEMIGOMUTANTE</a> © 2026
        </p>
        <a href="https://cafecito.app/enemigomutante" target="_blank" rel="noopener noreferrer" style={{ color: modoOscuro ? PALETA.azulClaro : PALETA.azulNavy, textDecoration: "none", fontWeight: "bold" }}>
          ☕ INVITAME UN CAFECITO
        </a>
      </footer>

    </div>
  );
}