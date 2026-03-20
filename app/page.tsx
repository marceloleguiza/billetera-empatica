'use client'
import { useState, useEffect, useRef } from "react";
import { Anton, Roboto_Mono } from "next/font/google";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [paso, setPaso] = useState(1);
  const [estadoFinanciero, setEstadoFinanciero] = useState("");
  const [gastito, setGastito] = useState("");
  const [monto, setMonto] = useState("");
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
    const timer = setTimeout(() => setSplash(false), 1500);
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
      id: i,
      x: Math.random() * 90 + 5,
      delay: Math.random() * 3,
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
    setTimeout(() => {
      accion();
      setPaso(nuevoPaso);
    }, 300);
  };

  const seleccionarEstado = (estado: string) => {
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    setGirando(true);
    setEstadoFinanciero(estado);
    let count = 0;
    const totalCambios = 12;
    intervalRef.current = setInterval(() => {
      const random = imagenes[Math.floor(Math.random() * imagenes.length)];
      setImgActual(random);
      count++;
      if (count >= totalCambios) {
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

  const confirmarMonto = () => {
    const montoNum = Number(monto.replace(/\./g, "").replace(",", "."));
    let respuestas: string[] = [];
    if (estadoFinanciero === "Ricachon") respuestas = respuestasRicachon;
    if (estadoFinanciero === "Pobreton") respuestas = respuestasPobreton;
    if (estadoFinanciero === "Indigente") respuestas = respuestasIndigente;
    const base = respuestas[Math.floor(Math.random() * respuestas.length)];
    const respuesta = `¿${gastito}? ${base}`;

    if (montoNum > 0) {
      const mesActual = new Date().getMonth();
      const gastosData = JSON.parse(localStorage.getItem("migastitoData") || `{"mes": ${mesActual}, "gastos": []}`);
      const nuevoHistorial = [...gastosData.gastos, { monto: montoNum, gastito, fecha: new Date().toISOString() }];
      localStorage.setItem("migastitoData", JSON.stringify({ mes: mesActual, gastos: nuevoHistorial }));
      const nuevoTotal = nuevoHistorial.reduce((acc: number, item: { monto: number }) => acc + item.monto, 0);
      setTotalMes(nuevoTotal);
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
        setTimeout(() => {
          setLogroNuevo(logro);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
        }, 1000);
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
    const texto = monto
      ? `Este mes ya quemé $${Number(monto).toLocaleString()} en ${gastito} 💀 ¿y vos? ${url}`
      : `¡Mirá mi gastito del mes! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const compartirInstagram = () => {
    descargarCard();
    alert("Guardá la imagen y subila a tus historias 😎");
  };

  const copiarLink = () => {
    navigator.clipboard.writeText("https://migastito.vercel.app");
    alert("¡Link copiado!");
  };

  const volverEmpezar = () => {
    cambiarPaso(1, () => {
      setEstadoFinanciero("");
      setGastito("");
      setMonto("");
      setRespuestaFinal("");
      setImgActual("ricachon");
      setSugerenciaActual(sugerencias[Math.floor(Math.random() * sugerencias.length)]);
    });
  };

  const totalVotos = votos.Ricachon + votos.Pobreton + votos.Indigente || 1;
  const bg = modoOscuro ? "#0f1e2a" : "#5ab0d4";
  const color = modoOscuro ? "#e0f4ff" : "#1a3a4a";
  const navBg = modoOscuro ? "rgba(15,30,42,0.9)" : "rgba(255,255,255,0.2)";
  const porcentajePaso = paso === 1 ? 25 : paso === 2 ? 50 : paso === 3 ? 75 : 100;

  if (splash) {
    return (
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#5ab0d4", color: "#1a3a4a", width: "100%", textAlign: "center", padding: "0 16px", boxSizing: "border-box" }}>
        <motion.img src="/grupal.png" alt="Personajes" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ width: "clamp(150px, 40vw, 250px)", objectFit: "contain" }} />
        <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>💸</div>
        <motion.h1 animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)", fontFamily: anton.style.fontFamily, letterSpacing: "clamp(1px, 0.5vw, 2px)", margin: 0 }}>
          MI GASTITO
        </motion.h1>
        <p style={{ marginTop: "16px", fontSize: "clamp(0.8rem, 2vw, 1rem)", opacity: 0.6, fontFamily: robotoMono.style.fontFamily }}>Cargando tu gastito del mes…</p>
      </main>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: bg, color: color, transition: "all 0.3s ease", fontFamily: robotoMono.style.fontFamily, width: "100%", boxSizing: "border-box" }}>

      {paso === 1 && monedas.map((m) => (
        <div key={m.id} style={{ position: "fixed", left: `${m.x}%`, top: "-40px", fontSize: "1.5rem", animation: `caer 4s ${m.delay}s infinite linear`, pointerEvents: "none", zIndex: 0 }}>💰</div>
      ))}

      <style>{`
        @keyframes caer {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.3; }
        }
        .tooltip-box {
          position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%);
          background: rgba(0,0,0,0.75); color: white; padding: 6px 12px;
          border-radius: 8px; font-size: 0.8rem; white-space: nowrap;
          pointer-events: none; z-index: 99;
        }
        .btn-opcion:hover { transform: scale(1.1) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important; }
        .btn-opcion:active { transform: scale(0.96) !important; }
      `}</style>

      {/* Modal logro */}
      <AnimatePresence>
        {logroNuevo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLogroNuevo(null)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ duration: 0.3 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ backgroundColor: modoOscuro ? "#0f1e2a" : "white", color: color, borderRadius: "20px", padding: "32px", maxWidth: "360px", width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: `2px solid ${color}` }}>
              <div style={{ fontSize: "4rem", marginBottom: "8px" }}>{logroNuevo.emoji}</div>
              <p style={{ fontSize: "0.8rem", opacity: 0.6, letterSpacing: "2px", marginBottom: "8px" }}>LOGRO DESBLOQUEADO</p>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "1.8rem", letterSpacing: "1px", marginBottom: "12px" }}>{logroNuevo.titulo.toUpperCase()}</h2>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.8, marginBottom: "20px" }}>{logroNuevo.descripcion}</p>
              <Button onClick={() => setLogroNuevo(null)} style={{ backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", width: "100%", fontFamily: robotoMono.style.fontFamily }}>
                ¡LO MEREZCO! 💪
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal logros */}
      <AnimatePresence>
        {modalLogrosAbierto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalLogrosAbierto(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ backgroundColor: modoOscuro ? "rgba(15,30,42,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", color: color, borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", position: "relative", fontFamily: robotoMono.style.fontFamily }}>
              <button onClick={() => setModalLogrosAbierto(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: color }}>
                <X size={20} />
              </button>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "clamp(1.2rem, 4vw, 1.8rem)", marginBottom: "20px", letterSpacing: "1px" }}>🏆 MIS LOGROS</h2>
              {LOGROS.map((logro) => {
                const desbloqueado = logrosDesbloqueados.includes(logro.id);
                return (
                  <div key={logro.id} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", opacity: desbloqueado ? 1 : 0.35 }}>
                    <span style={{ fontSize: "1.8rem" }}>{desbloqueado ? logro.emoji : "🔒"}</span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontWeight: "bold", fontSize: "0.9rem", margin: 0 }}>{logro.titulo}</p>
                      <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: 0 }}>{logro.descripcion}</p>
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "16px" }}>{logrosDesbloqueados.length}/{LOGROS.length} logros desbloqueados</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal ¿Qué es esto? */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalAbierto(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              style={{ backgroundColor: modoOscuro ? "rgba(15,30,42,0.92)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", color: color, borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", position: "relative", fontFamily: robotoMono.style.fontFamily }}>
              <button onClick={() => setModalAbierto(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: color }}>
                <X size={20} />
              </button>
              <h2 style={{ fontFamily: anton.style.fontFamily, fontSize: "clamp(1.2rem, 4vw, 1.8rem)", marginBottom: "16px", letterSpacing: "1px" }}>💸 ¿QUÉ ES MI GASTITO?</h2>
              <p style={{ marginBottom: "12px", lineHeight: 1.6 }}>Es una app para celebrar tus decisiones financieras sin culpa. Sabemos que a veces la billetera no acompaña… pero el gastito igual va.</p>
              <p style={{ marginBottom: "12px", lineHeight: 1.6 }}><strong>¿Cómo funciona?</strong></p>
              <p style={{ marginBottom: "8px", lineHeight: 1.6 }}>💰 <strong>Ricachón</strong> — Este mes sobra plata y también actitud.</p>
              <p style={{ marginBottom: "8px", lineHeight: 1.6 }}>😬 <strong>Pobretón</strong> — Alcanza justo… pero el gastito igual va.</p>
              <p style={{ marginBottom: "16px", lineHeight: 1.6 }}>💀 <strong>Indigente</strong> — La billetera llora, pero el corazón manda.</p>
              <p style={{ lineHeight: 1.6, opacity: 0.7, fontSize: "0.9rem" }}>Elegís tu estado, escribís tu gastito, confirmás cuánto vas a gastar y recibís una respuesta empática. ¡Sin juicios!</p>
              <Button onClick={() => setModalAbierto(false)} style={{ marginTop: "20px", backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", width: "100%", fontFamily: robotoMono.style.fontFamily }}>
                ¡ENTENDIDO, VAMOS! 🚀
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: navBg, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        padding: "16px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", boxSizing: "border-box", minHeight: "72px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "120px" }}>
          <span style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)", fontFamily: robotoMono.style.fontFamily, opacity: 0.7 }}>
            🧾 {contador} gastitos
          </span>
          {totalMes > 0 && (
            <span style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", fontFamily: robotoMono.style.fontFamily, fontWeight: "bold" }}>
              💸 ${totalMes.toLocaleString()}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setModalLogrosAbierto(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: color, display: "flex", alignItems: "center", gap: "6px", fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)", fontFamily: robotoMono.style.fontFamily, padding: "8px 12px", borderRadius: "10px", backgroundColor: modoOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
            <Trophy size={18} /> {logrosDesbloqueados.length}/{LOGROS.length}
          </button>
          <button onClick={() => setModalAbierto(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: color, padding: "8px", borderRadius: "10px", backgroundColor: modoOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", display: "flex", alignItems: "center" }}>
            <Info size={20} />
          </button>
          <button onClick={() => setModoOscuro(!modoOscuro)}
            style={{ background: "none", border: "none", cursor: "pointer", color: color, padding: "8px", borderRadius: "10px", backgroundColor: modoOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", display: "flex", alignItems: "center" }}>
            {modoOscuro ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "90px 20px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ zIndex: 1, textAlign: "center", width: "100%", marginBottom: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/grupal.png" alt="Personajes"
            style={{ width: "clamp(160px, 40vw, 280px)", objectFit: "contain", display: "block", margin: "0 auto" }} />
          <h1 style={{ fontSize: "clamp(1.5rem, 6vw, 4rem)", margin: 0, fontFamily: anton.style.fontFamily, letterSpacing: "clamp(1px, 0.5vw, 3px)", lineHeight: 1.1 }}>
            MI GASTITO
          </h1>
        </motion.div>

        <p style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)", marginBottom: "8px", opacity: 0.7, zIndex: 1, fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px", textAlign: "center", width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
          {mensajesPorHora()}
        </p>

        {/* Barra de progreso con labels */}
        <div style={{ width: "100%", maxWidth: "600px", marginBottom: "24px", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            {labelsPaso.map((label, i) => (
              <span key={label} style={{
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                fontFamily: robotoMono.style.fontFamily,
                opacity: paso === i + 1 ? 1 : 0.4,
                fontWeight: paso === i + 1 ? "bold" : "normal",
                color: paso === i + 1 ? color : undefined,
                transition: "all 0.3s ease",
              }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{ width: "100%", height: "10px", backgroundColor: modoOscuro ? "#1e3a4a" : "#b0d8f0", borderRadius: "999px" }}>
            <motion.div animate={{ width: `${porcentajePaso}%` }} transition={{ duration: 0.4 }} style={{ height: "100%", backgroundColor: color, borderRadius: "999px" }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={paso} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}
            style={{ width: "100%", maxWidth: "600px", zIndex: 1, textAlign: "center" }}>

            {/* PASO 1 — orden: título → personajes → estadísticas → botón destino */}
            {paso === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ backgroundColor: modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.12)", border: `2px solid ${color}`, borderRadius: "24px", padding: "clamp(16px, 4vw, 32px)", width: "100%", boxSizing: "border-box" }}>

                {/* 1. Título */}
                <p style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", marginBottom: "24px", letterSpacing: "1px", fontWeight: "bold" }}>
                  ¿QUÉ TAN ROTO ESTÁS ESTE MES? 💀
                </p>

                {/* 2. Personajes + botones — PRIORIDAD */}
                {girando ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <motion.img key={imgActual} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={`/${imgActual}.png`} alt="girando"
                      style={{ width: "clamp(100px, 25vw, 160px)", height: "clamp(100px, 25vw, 160px)", objectFit: "contain" }} />
                    <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>ANALIZANDO TU BILLETERA…</p>
                  </div>
                ) : (
                  <motion.div variants={botonesVariants} initial="hidden" animate="show"
                    style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", marginBottom: "24px" }}>
                    {opcionesPaso1.map(({ id, label }) => (
                      <motion.div key={id} variants={botonVariant}
                        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
                        onMouseEnter={() => setTooltipVisible(id)} onMouseLeave={() => setTooltipVisible("")}>
                        {tooltipVisible === id && <div className="tooltip-box">{tooltipPorEstado[id]}</div>}
                        <img src={`/${id.toLowerCase()}.png`} alt={label} style={{ width: "clamp(80px, 15vw, 120px)", height: "clamp(80px, 15vw, 120px)", objectFit: "contain" }} />
                        <Button size="lg" variant="outline" onClick={() => seleccionarEstado(id)}
                          className="btn-opcion"
                          style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)", padding: "20px clamp(16px, 3vw, 32px)", borderColor: color, color: color, backgroundColor: "transparent", fontWeight: "bold", borderRadius: "16px", transition: "transform 0.15s ease, box-shadow 0.15s ease", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
                          {label}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* 3. Estadísticas de votos */}
                {totalVotos > 1 && (
                  <div style={{ marginBottom: "20px", fontSize: "0.75rem", opacity: 0.7 }}>
                    {opcionesPaso1.map(({ id, label }) => (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", justifyContent: "center" }}>
                        <span style={{ width: "100px", textAlign: "right" }}>{label}</span>
                        <div style={{ width: "120px", height: "4px", backgroundColor: modoOscuro ? "#1e3a4a" : "#b0d8f0", borderRadius: "999px" }}>
                          <motion.div animate={{ width: `${Math.round((votos[id as keyof typeof votos] / totalVotos) * 100)}%` }} transition={{ duration: 0.4 }} style={{ height: "100%", backgroundColor: color, borderRadius: "999px" }} />
                        </div>
                        <span>{Math.round((votos[id as keyof typeof votos] / totalVotos) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Botón destino — abajo de todo */}
                <Button onClick={() => seleccionarEstado(opcionesPaso1[Math.floor(Math.random() * 3)].id)}
                  style={{ backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px", width: "100%" }}>
                  🎰 QUE DECIDA EL DESTINO
                </Button>

              </motion.div>
            )}

            {paso === 2 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "0 16px", boxSizing: "border-box" }}>
                <h2 style={{ fontSize: "clamp(1rem, 4vw, 1.8rem)", fontFamily: anton.style.fontFamily, letterSpacing: "clamp(1px, 0.5vw, 2px)", textAlign: "center" }}>¿QUÉ GASTITO TE QUERÉS DAR?</h2>
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  src={`/${estadoFinanciero.toLowerCase()}.png`} alt={estadoFinanciero}
                  style={{ width: "clamp(120px, 30vw, 200px)", height: "clamp(120px, 30vw, 200px)", objectFit: "contain" }} />
                <div style={{ width: "100%", maxWidth: "300px", textAlign: "left" }}>
                  <label style={{ fontSize: "0.75rem", opacity: 0.7, fontFamily: robotoMono.style.fontFamily, display: "block", marginBottom: "4px" }}>
                    ¿En qué vas a gastar?
                  </label>
                  <input
                    ref={inputGastitoRef}
                    type="text"
                    placeholder={sugerenciaActual}
                    value={gastito}
                    onChange={(e) => setGastito(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmarGastito()}
                    aria-label="Escribí tu gastito"
                    style={{ padding: "12px", fontSize: "clamp(12px, 2vw, 14px)", width: "100%", borderRadius: "8px", border: `2px solid ${color}`, color: color, backgroundColor: "transparent", boxSizing: "border-box", fontFamily: robotoMono.style.fontFamily, outline: "none" }}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                  💡 Sugerencia: <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setGastito(sugerenciaActual)}>{sugerenciaActual}</span>
                </p>
                <Button size="lg" onClick={confirmarGastito} style={{ backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
                  SIGUIENTE →
                </Button>
              </div>
            )}

            {paso === 3 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "0 16px", boxSizing: "border-box" }}>
                <h2 style={{ fontSize: "clamp(1rem, 4vw, 1.8rem)", fontFamily: anton.style.fontFamily, letterSpacing: "clamp(1px, 0.5vw, 2px)", textAlign: "center" }}>¿CUÁNTO PENSÁS GASTAR?</h2>
                <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>en {gastito}</p>
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  src={`/${estadoFinanciero.toLowerCase()}.png`} alt={estadoFinanciero}
                  style={{ width: "clamp(100px, 25vw, 160px)", height: "clamp(100px, 25vw, 160px)", objectFit: "contain" }} />
                <div style={{ width: "100%", maxWidth: "300px", textAlign: "left" }}>
                  <label style={{ fontSize: "0.75rem", opacity: 0.7, fontFamily: robotoMono.style.fontFamily, display: "block", marginBottom: "4px" }}>
                    Monto en pesos
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontWeight: "bold", fontSize: "16px" }}>$</span>
                    <input
                      ref={inputMontoRef}
                      type="number"
                      placeholder={placeholderMonto}
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && confirmarMonto()}
                      aria-label="Cuánto pensás gastar"
                      style={{ padding: "12px 12px 12px 28px", fontSize: "clamp(14px, 2vw, 16px)", width: "100%", borderRadius: "8px", border: `2px solid ${color}`, color: color, backgroundColor: "transparent", boxSizing: "border-box", fontFamily: robotoMono.style.fontFamily, outline: "none" }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button size="lg" onClick={confirmarMonto} style={{ backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
                    CONFIRMAR 💸
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => { setMonto("0"); confirmarMonto(); }}
                    style={{ borderColor: color, color: color, backgroundColor: "transparent", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
                    SALTEAR
                  </Button>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "0 16px", boxSizing: "border-box" }}>
                <h2 style={{ fontSize: "clamp(1.2rem, 5vw, 2.5rem)", fontFamily: anton.style.fontFamily, letterSpacing: "clamp(1px, 0.5vw, 2px)", textAlign: "center" }}>{gastito.toUpperCase()}</h2>
                {monto && Number(monto) > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                    style={{ backgroundColor: modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)", border: `1px solid ${color}`, borderRadius: "12px", padding: "12px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: "1.4rem", fontFamily: anton.style.fontFamily, margin: 0 }}>${Number(monto).toLocaleString()}</p>
                    <p style={{ fontSize: "0.7rem", opacity: 0.6, margin: 0 }}>{frasePorTotal(totalMes)}</p>
                  </motion.div>
                )}
                <p style={{ fontSize: "clamp(0.8rem, 2.5vw, 1rem)", fontStyle: "italic", maxWidth: "460px", lineHeight: 1.7, textAlign: "center" }}>
                  {respuestaFinal}
                  <br /><br />
                  <strong>¿Y vos? Probalo 👇</strong>
                </p>
                <p style={{ fontSize: "0.7rem", opacity: 0.6, fontFamily: robotoMono.style.fontFamily }}>
                  🔥 Ya somos {contador} personas gastando sin culpa
                </p>
                <motion.img src={cardPorEstado[estadoFinanciero]} alt="Mi gastito" whileHover={{ scale: 1.25 }} transition={{ duration: 0.2 }}
                  style={{ width: "clamp(200px, 70vw, 300px)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", cursor: "pointer" }} />
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  <Button size="sm" onClick={descargarCard} style={{ backgroundColor: color, color: modoOscuro ? "#0f1e2a" : "white", fontFamily: robotoMono.style.fontFamily }}><Download size={16} /> DESCARGAR</Button>
                  <Button size="sm" onClick={compartirWhatsApp} style={{ backgroundColor: "#25D366", color: "white", fontFamily: robotoMono.style.fontFamily }}><MessageCircle size={16} /> WHATSAPP</Button>
                  <Button size="sm" onClick={compartirInstagram} style={{ backgroundColor: "#E1306C", color: "white", fontFamily: robotoMono.style.fontFamily }}><Instagram size={16} /> INSTAGRAM</Button>
                  <Button size="sm" onClick={copiarLink} style={{ backgroundColor: "#555", color: "white", fontFamily: robotoMono.style.fontFamily }}><Link size={16} /> COPIAR LINK</Button>
                </div>
                <Button variant="outline" size="lg" onClick={volverEmpezar} style={{ borderColor: color, color: color, backgroundColor: "transparent", marginTop: "8px", fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
                  <RefreshCw size={16} /> VOLVER A EMPEZAR
                </Button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)", opacity: 0.6, borderTop: `1px solid ${modoOscuro ? "#1e3a4a" : "#b0d8f0"}`, fontFamily: robotoMono.style.fontFamily, letterSpacing: "1px" }}>
        <p style={{ marginBottom: "8px" }}>
          HECHO POR <a href="https://instagram.com/enemigomutante" target="_blank" rel="noopener noreferrer" style={{ color: color, textDecoration: "none", fontWeight: "bold" }}>@ENEMIGOMUTANTE</a> © 2026
        </p>
        <a href="https://cafecito.app/mutazion" target="_blank" rel="noopener noreferrer" style={{ color: color, textDecoration: "none", fontWeight: "bold" }}>
          ☕ INVITAME UN CAFECITO
        </a>
      </footer>

    </div>
  );
}
