"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Calendar, MapPin, Gift, Users, ImageIcon, X, Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function WeddingWebsite() {
  const [scrolled, setScrolled] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)
  const [wishes, setWishes] = useState<Array<{ name: string; message: string; timestamp: number }>>([])
  const [wishName, setWishName] = useState("")
  const [wishMessage, setWishMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Add state for RSVP form (after other useStates)
  const [confirming, setConfirming] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [guests, setGuests] = useState("1 người");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState<null | string>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchWishes()
  }, [])

  const weddingDate = new Date("2025-12-31T14:00:00")
  const timeLeft = Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % 6)
    }
  }

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + 6) % 6)
    }
  }

  const fetchWishes = async () => {
    try {
      const response = await fetch("/api/wishes")
      if (response.ok) {
        const data = await response.json()
        setWishes(data)
      }
    } catch (error) {
      console.error("Error fetching wishes:", error)
    }
  }

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishName.trim() || !wishMessage.trim()) return

    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wishName, message: wishMessage }),
      })

      if (response.ok) {
        setWishName("")
        setWishMessage("")
        fetchWishes()
      }
    } catch (error) {
      console.error("Error submitting wish:", error)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      console.log("[v0] Current playing state:", isPlaying)
      console.log("[v0] Audio src:", audioRef.current.src)

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        console.log("[v0] Music paused")
      } else {
        audioRef.current.volume = 0.5 // Set volume to 50%
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              console.log("[v0] Music playing successfully")
            })
            .catch((error) => {
              console.error("[v0] Audio play failed:", error)
              setIsPlaying(false)
              alert("Không thể phát nhạc. Vui lòng kiểm tra file nhạc hoặc thử lại.")
            })
        }
      }
    } else {
      console.log("[v0] Audio ref is null")
    }
  }

  // Add submit handler for RSVP
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirming(true);
    setConfirmSuccess(null);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: confirmName,
          email: confirmEmail,
          guests,
          message: confirmMessage,
        }),
      });
      if (response.ok) {
        setConfirmSuccess("Gửi thành công!");
        setConfirmName("");
        setConfirmEmail("");
        setGuests("1 người");
        setConfirmMessage("");
      } else {
        setConfirmSuccess("Gửi thất bại, vui lòng thử lại.");
      }
    } catch {
      setConfirmSuccess("Có lỗi, vui lòng thử lại.");
    }
    setConfirming(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <audio
        ref={audioRef}
        src="/nhac.mp3"
        preload="metadata"
        loop
      />
      <button
        onClick={toggleMusic}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
        title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
        aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
      </button>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      >
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="font-serif text-2xl text-primary tracking-wide">S & L</div>
            <div className="hidden md:flex items-center gap-8 font-serif text-sm tracking-wider">
              <a href="#story" className="hover:text-primary transition-colors duration-300">
                Câu Chuyện
              </a>
              <a href="#details" className="hover:text-primary transition-colors duration-300">
                Chi Tiết
              </a>
              <a href="#gallery" className="hover:text-primary transition-colors duration-300">
                Bộ Sưu Tập
              </a>
              <a href="#gift" className="hover:text-primary transition-colors duration-300">
                Mừng Cưới
              </a>
              <a href="#rsvp" className="hover:text-primary transition-colors duration-300">
                Xác Nhận
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <img
          src="/banner.jpg"
          alt="Wedding couple"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <div className="mb-8">
            <Heart className="w-12 h-12 mx-auto text-primary animate-pulse" />
          </div>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-primary mb-6 text-balance leading-none tracking-tight">
            Sáng & Linh
          </h1>
          <div className="font-serif text-xl md:text-2xl text-muted-foreground tracking-widest mb-8">
            31 • 12 • 2025
          </div>
          <p className="font-serif text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            Chúng tôi rất vui mừng được chia sẻ ngày đặc biệt này cùng những người thân yêu
          </p>
          <Button
            size="lg"
            className="font-serif tracking-wider text-base px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300"
            onClick={() => setIsInvitationOpen(true)}
          >
            Xem Thiệp Mời
          </Button>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4 text-balance">
              Đếm Ngược Đến Ngày Trọng Đại
            </h2>
            <div className="flex items-center justify-center gap-8 md:gap-16 mt-12">
              <div className="text-center">
                <div className="font-serif text-5xl md:text-7xl text-primary mb-2">{timeLeft}</div>
                <div className="font-serif text-sm md:text-base text-muted-foreground tracking-widest">NGÀY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-5xl md:text-6xl text-primary mb-12 text-balance leading-tight">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <div className="space-y-16">
              <div className="animate-fade-in">
                <div className="font-serif text-2xl text-primary mb-4">Lần Đầu Gặp Gỡ</div>
                <p className="font-serif text-lg leading-relaxed text-foreground/80 text-pretty">
                  Chúng tôi gặp nhau vào một buổi chiều mùa thu tuyệt đẹp tại quán cà phê nhỏ. Ánh mắt đầu tiên đã khiến
                  trái tim chúng tôi rung động, và từ đó, một câu chuyện tình yêu đẹp đẽ bắt đầu.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-200">
                <div className="font-serif text-2xl text-primary mb-4">Lời Cầu Hôn</div>
                <p className="font-serif text-lg leading-relaxed text-foreground/80 text-pretty">
                  Dưới bầu trời đầy sao, bên bờ biển lãng mạn, anh đã quỳ gối và hỏi cô câu hỏi quan trọng nhất trong
                  đời. Và với đôi mắt rưng rưng hạnh phúc, cô đã nói "có".
                </p>
              </div>

              <div className="animate-fade-in animation-delay-400">
                <div className="font-serif text-2xl text-primary mb-4">Hành Trình Mới</div>
                <p className="font-serif text-lg leading-relaxed text-foreground/80 text-pretty">
                  Giờ đây, chúng tôi sẵn sàng bước vào chương mới của cuộc đời, nơi mà tình yêu và cam kết sẽ là nền
                  tảng cho mọi điều tuyệt vời sắp tới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section id="details" className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-5xl md:text-6xl text-primary text-center mb-20 text-balance">
            Chi Tiết Hôn Lễ
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 bg-background border-border/50">
              <Calendar className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-3xl text-primary mb-4">Thời Gian</h3>
              <p className="font-san-serif text-lg text-foreground/80 leading-relaxed">
                Thứ Tư, 31 tháng 12, 2025
                <br />
                Lễ cưới: 14:00
                <br />
                Tiệc chiêu đãi: 17:30
              </p>
            </Card>

            <Card className="p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 bg-background border-border/50">
              <MapPin className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-3xl text-primary mb-4">Địa Điểm</h3>
              <p className="font-serif text-lg text-foreground/80 leading-relaxed">
                Blue Lotus Convention Center
                <br />
                66 Lê Văn Lương
                <br />
                Thanh Xuân - Hà Nội
              </p>
            </Card>

            <Card className="p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 bg-background border-border/50">
              <Users className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-3xl text-primary mb-4">Dress Code</h3>
              <p className="font-serif text-lg text-foreground/80 leading-relaxed">
                Trang phục trang trọng
                <br />
                Gợi ý: Đầm dạ hội và Vest
                <br />
                Màu chủ đạo: Hồng phấn & Xanh dương nhạt
              </p>
            </Card>

            <Card className="p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 bg-background border-border/50">
              <Gift className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-3xl text-primary mb-4">Quà Cưới</h3>
              <p className="font-serif text-lg text-foreground/80 leading-relaxed">
                Sự hiện diện của quý khách
                <br />
                là món quà quý giá nhất
                <br />
                dành cho chúng tôi
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-5xl md:text-6xl text-primary text-center mb-20 text-balance">
            Khoảnh Khắc Đẹp
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => setSelectedImage(i - 1)}
              >
                <picture>
                  <source srcSet={`/pic${i}.webp`} type="image/webp" />
                  <img
                    src={`/pic${i}.jpg`}
                    alt={`Gallery ${i}`}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wishes Section */}
      <section className="py-20 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl text-primary text-center mb-12 text-balance">
            Lời Chúc Từ Mọi Người
          </h2>

          {/* Wishes Form */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="p-6 md:p-8 bg-background/80 backdrop-blur border-border/50">
              <form onSubmit={submitWish} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Tên của bạn</label>
                  <input
                    type="text"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300"
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Lời chúc</label>
                  <textarea
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300 resize-none"
                    placeholder="Gửi lời chúc đến cô dâu và chú rể..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 font-serif tracking-wider text-base rounded-full hover:scale-105 transition-transform duration-300 gap-2"
                >
                  <Send className="w-4 h-4" />
                  Gửi Lời Chúc
                </Button>
              </form>
            </Card>
          </div>

          {/* Scrolling Wishes Display */}
          {wishes.length > 0 && (
            <div className="relative">
              <div className="wishes-scroll-container">
                <div className="wishes-scroll">
                  {wishes.concat(wishes).map((wish, index) => (
                    <div
                      key={`${wish.timestamp}-${index}`}
                      className="wishes-item inline-block mx-4 bg-background/90 backdrop-blur border border-primary/20 rounded-2xl p-6 shadow-lg min-w-[300px] max-w-[400px]"
                    >
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-serif text-lg text-primary mb-2">{wish.name}</p>
                          <p className="font-serif text-sm text-foreground/80 leading-relaxed">{wish.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
            className="absolute left-4 text-white hover:text-primary transition-colors text-4xl p-4"
          >
            ‹
          </button>

          <div className="max-w-5xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <picture>
              <source srcSet={`/pic${selectedImage + 1}.webp`} type="image/webp" />
              <img
                src={`/pic${selectedImage + 1}.jpg`}
                alt={`Gallery ${selectedImage + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </picture>
            <div className="text-center mt-4 text-white font-serif tracking-wider">{selectedImage + 1} / 6</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            className="absolute right-4 text-white hover:text-primary transition-colors text-4xl p-4"
          >
            ›
          </button>
        </div>
      )}

      {isInvitationOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsInvitationOpen(false)}
        >
          <div className="relative max-w-4xl w-full perspective-1000" onClick={(e) => e.stopPropagation()}>
            {/* <button
              onClick={() => setIsInvitationOpen(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 transition-all p-2 rounded-full shadow-lg z-50 backdrop-blur-sm"
              aria-label="Đóng thiệp"
            >
              <X className="w-6 h-6" />
            </button> */}

            <div className="invitation-card bg-gradient-to-br from-pink-50 via-white to-blue-50 rounded-2xl shadow-2xl p-8 md:p-16 border-4 border-primary/20 animate-invitation-open">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-lg"></div>

              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="py-6 space-y-6">
                    <div className="flex items-center justify-center h-full">
                      <img src="/evenlop1.png" alt="evenlop" />
                    </div>
                    <div className="pt-4">
                      {/* <p className="font-serif text-lg md:text-xl text-primary/80 italic">
                        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi
                      </p> */}
                      <Button className="font-serif text-lg md:text-xl italic" onClick={() => setIsInvitationOpen(false)}>Đóng thiệp</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Section */}
      <section id="rsvp" className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-5xl md:text-6xl text-primary mb-8 text-balance">Xác Nhận Tham Dự</h2>
            <p className="font-serif text-lg text-foreground/80 mb-12 leading-relaxed text-pretty">
              Vui lòng xác nhận sự tham dự của bạn trước ngày 1 tháng 8, 2025 để chúng tôi có thể chuẩn bị chu đáo nhất.
            </p>
            <Card className="p-8 md:p-12 bg-background border-border/50">
              <form onSubmit={handleConfirmSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Họ và Tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300"
                    placeholder="Nhập họ và tên của bạn"
                    value={confirmName}
                    onChange={e => setConfirmName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300"
                    placeholder="email@example.com"
                    value={confirmEmail}
                    onChange={e => setConfirmEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Số Lượng Khách</label>
                  <select
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                  >
                    <option>1 người</option>
                    <option>2 người</option>
                    <option>3 người</option>
                    <option>4 người</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-serif text-sm tracking-wider text-left block">Lời Nhắn</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background transition-all duration-300 resize-none"
                    placeholder="Gửi lời chúc đến cô dâu và chú rể..."
                    value={confirmMessage}
                    onChange={e => setConfirmMessage(e.target.value)}
                  />
                </div>
                <Button className="w-full py-6 font-serif tracking-wider text-base rounded-full hover:scale-105 transition-transform duration-300" type="submit" disabled={confirming}>
                  {confirming ? "Đang gửi..." : "Gửi Xác Nhận"}
                </Button>
                {confirmSuccess && (
                  <div className="mt-2 text-center text-primary font-serif">{confirmSuccess}</div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Online Gift Section */}
      <section id="gift" className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-5xl md:text-6xl text-primary mb-8 text-balance">Mừng Cưới Online</h2>
            <p className="font-serif text-lg text-foreground/80 mb-16 leading-relaxed text-pretty">
              Nếu không thể đến dự, quý khách có thể gửi lời chúc và mừng cưới qua chuyển khoản. Chúng tôi xin chân
              thành cảm ơn!
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Bride QR Code */}
              <Card className="p-8 md:p-12 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-white border-primary/20">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-pink-200/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-pink-600" />
                  </div>
                  <h3 className="font-serif text-3xl text-primary mb-2">Cô Dâu</h3>
                  <p className="font-serif text-2xl text-foreground/90 mb-1">Quỳnh Linh</p>
                </div>

                <div className="bg-white p-6 rounded-xl mb-6 shadow-sm">
                  <img
                    src="/qr-co-dau.jpg"
                    alt="QR Code cô dâu"
                    className="w-full max-w-[280px] mx-auto"
                  />
                </div>

                <div className="text-left space-y-3 bg-white/50 p-6 rounded-lg">
                  <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="font-serif text-sm text-muted-foreground">Ngân hàng:</span>
                    <span className="font-medium text-foreground">Techcombank</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="font-serif text-sm text-muted-foreground">Số tài khoản:</span>
                    <span className="font-medium text-foreground">1903 6617 1610 15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-sm text-muted-foreground">Chủ tài khoản:</span>
                    <span className="font-medium text-foreground">LÊ QUỲNH LINH</span>
                  </div>
                </div>
              </Card>

              {/* Groom QR Code */}
              <Card className="p-8 md:p-12 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white border-primary/20">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-200/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="font-serif text-3xl text-primary mb-2">Chú Rể</h3>
                  <p className="font-serif text-2xl text-foreground/90 mb-1">Quang Sáng</p>
                </div>

                <div className="bg-white p-6 rounded-xl mb-6 shadow-sm">
                  <img
                    src="/qr-chu-re.jpg"
                    alt="QR Code chú rể"
                    className="w-full max-w-[280px] mx-auto"
                  />
                </div>

                <div className="text-left space-y-3 bg-white/50 p-6 rounded-lg">
                  <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="font-serif text-sm text-muted-foreground">Ngân hàng:</span>
                    <span className="font-medium text-foreground">TPBank</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                    <span className="font-serif text-sm text-muted-foreground">Số tài khoản:</span>
                    <span className="font-medium text-foreground">6818 6978 888</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-sm text-muted-foreground">Chủ tài khoản:</span>
                    <span className="font-medium text-foreground">BÙI QUANG SÁNG</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-primary/10">
              <p className="font-serif text-base text-foreground/80 leading-relaxed text-pretty">
                <span className="font-serif text-primary text-lg">Nội dung chuyển khoản:</span>
                <br />
                Mừng cưới Sáng & Linh + [Tên của bạn]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-primary/5 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-8 h-8 mx-auto text-primary mb-4" />
          <p className="font-serif text-2xl text-primary mb-2">Sáng & Linh</p>
          <p className="font-serif text-sm text-muted-foreground tracking-widest">31 • 12 • 2025</p>
          <p className="font-serif text-sm text-muted-foreground mt-8">Made with love for our special day</p>
        </div>
      </footer>
    </div>
  )
}
