import React from 'react'
import { motion } from "motion/react"
import { FaFacebook, FaFacebookF, FaInstagram, FaLinkedin, FaLinkedinIn, FaTwitter, FaXTwitter } from 'react-icons/fa6'
import { Link } from 'react-router-dom';

const Footer = () => {

    const FOOTER_LINKS = [
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "Book a Ride", href: "/rides" },
                { label: "Become a Driver", href: "/partner/become-partner" },
                { label: "Corporate Travel", href: "/business" },
                { label: "Airport Transfers", href: "/airport-transfer" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "Help Center", href: "/help" },
                { label: "Safety", href: "/safety" },
                { label: "FAQs", href: "/faq" },
                { label: "Report an Issue", href: "/report" },
            ],
        },
        {
            title: "Legal",
            links: [
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Refund Policy", href: "/refund-policy" },
            ],
        },
    ];

    const SOCIALS = [
        { icon: FaFacebookF, x: -110 },
        { icon: FaInstagram, x: -35 },
        { icon: FaLinkedinIn, x: 35 },
        { icon: FaXTwitter, x: 110 },

    ];

    return (
        <footer className='w-full bg-background text-white'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className='max-w-7xl mx-auto px-6'
            >
                {/* Logo */}
                <div className='flex flex-col py-8 pt-16'>
                    <img src="logo.png" alt="Logo" className='w-24' />
                    <p className='my-4 text-gray-400 text-xs leading-relaxed w-3/4'>Book any vihicle - from bike to trucks. Trusted owner. Transparent pricing.</p>
                </div>

                {/* Footer links grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 sm:py-8 border-t  border-white/20">
                    {FOOTER_LINKS.map((section) => (
                        <div key={section.title}>
                            <h3 className="mb-4 text-[18px] font-extrabold sm:font-semibold">
                                {section.title}
                            </h3>

                            <ul className="space-y-2 sm:space-y-1.5">
                                {section.links.map((link, i) => (
                                    <motion.li
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * i }}
                                        key={link.href}>
                                        <Link className='text-[max(15px)] text-zinc-500 hover:text-zinc-200 hover:underline transition-colors duration-200' to={link.href}>
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className='border-t border-white/20'>
                {/* Social media icons */}
                    <div className='relative flex justify-center items-center h-22'>
                        {SOCIALS.map(({ icon: Icon, x }, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    x: 0,
                                    opacity: 0,
                                }}
                                whileInView={{
                                    x,
                                    opacity: [0.5, 1],
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.02 + 0.15,
                                    ease: "linear",
                                }}
                                className="absolute w-10 h-10 rounded-full bg-white text-background shadow-lg flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform "
                            >
                                <Icon />
                            </motion.div>
                        ))}
                    </div>
                    {/* Copyright */}
                    <div className='max-w-7xl mx-auto pb-6 flex flex-col sm:flex-row sm:justify-center justify-between items-center text-xs text-gray-500 gap-4'>
                        <p>&copy; {new Date().getFullYear()} MOVEZ. All rights reserved. </p>
                    </div>
                </div>
            </motion.div>
        </footer>
    )
}

export default Footer