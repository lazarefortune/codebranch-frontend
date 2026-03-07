'use client'

import {
    Code2,
    ExternalLink,
    GitBranch,
    GitFork,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Star,
    Twitter
} from "lucide-react";
import demoAvatar from "@/assets/demo-avatar.jpg";
import Image from "next/image";
import {motion} from "framer-motion";

const repos = [
    {
        name: "react-dashboard",
        description: "Dashboard admin moderne avec React & TypeScript",
        stars: 142,
        forks: 38,
        language: "TypeScript"
    },
    {
        name: "node-api-starter",
        description: "Boilerplate API REST avec Node.js, Express & Prisma",
        stars: 89,
        forks: 22,
        language: "JavaScript"
    },
    {
        name: "css-animations-lib",
        description: "Bibliothèque d'animations CSS légère et performante",
        stars: 256,
        forks: 41,
        language: "CSS"
    },
];

const skills = ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "GraphQL", "Tailwind CSS", "Next.js"];

const socialLinks = [
    {icon: Github, label: "GitHub", url: "#", username: "@alexdev"},
    {icon: Twitter, label: "Twitter", url: "#", username: "@alexdev_"},
    {icon: Linkedin, label: "LinkedIn", url: "#", username: "Alexandre Martin"},
    {icon: Globe, label: "Portfolio", url: "#", username: "alexdev.fr"},
    {icon: Mail, label: "Email", url: "#", username: "alex@dev.fr"},
];

const fadeUp = {
    hidden: {opacity: 0, y: 20},
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: i * 0.08,
            ease: "easeOut" as const,
        },
    })
}

export default function DemoPage() {


    return (
        <div className="container relative z-10 mx-auto max-w-2xl pb-16 pt-24">
            <div className="absolute inset-0 -z-10 bg-gradient-radial pointer-events-none"/>
            <div className="mx-auto gap-4 py-8">
                {/* Profile Header */}
                <motion.section initial="hidden"
                                animate="visible"
                                className="mb-8 text-center"
                >
                    <motion.div variants={fadeUp} custom={0} className="mb-4">
                        <Image src={demoAvatar} alt="Demo Avatar"
                               className="mx-auto h-28 w-28 rounded-full border-2 border-primary object-cover glow-primary"/>
                    </motion.div>
                    <motion.h1 variants={fadeUp} custom={1} className="text-3xl font-bold">
                        Alexandre Martin
                    </motion.h1>
                    <motion.p variants={fadeUp} custom={2} className="mt-1 font-mono text-base text-primary">
                        Développeur Full-Stack
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3}
                                className="mt-2 flex items-center justify-center gap-1 text-base text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5"/>
                        Paris, France
                    </motion.div>
                    <motion.p variants={fadeUp} custom={4}
                              className="mx-auto mt-4 max-w-md text-base text-muted-foreground leading-relaxed">
                        Passionné par le web moderne. Je construis des apps performantes avec React, Node.js et
                        TypeScript.
                    </motion.p>
                </motion.section>

                {/* Links Section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    className="mb-8 space-y-3"
                >
                    <motion.h2
                        className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="font-mono text-primary">&#47;&#47;</span> Mes liens
                    </motion.h2>
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={link.label}
                            href={link.url}
                            variants={fadeUp}
                            custom={index + 1}
                            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:glow-primary group"
                        >
                            <div className="rounded-lg bg-secondary p-2.5">
                                <link.icon className="h-5 w-5 text-primary"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-medium">{link.label}</p>
                                <p className="text-sm text-muted-foreground font-mono">{link.username}</p>
                            </div>
                            <ExternalLink
                                className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"/>
                        </motion.a>
                    ))}
                </motion.section>

                {/* GitHub Repos */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    className="mb-8"
                >
                    <motion.h2 variants={fadeUp} custom={0}
                               className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="font-mono text-primary">&#47;&#47;</span> Projets GitHub
                    </motion.h2>
                    <div className="space-y-3">
                        {repos.map((repo, i) => (
                            <motion.div
                                key={repo.name}
                                variants={fadeUp}
                                custom={i + 1}
                                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:glow-primary"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                                            <Code2 className="h-4 w-4 text-primary"/>
                                            {repo.name}
                                        </h3>
                                        <p className="mt-1 text-base text-muted-foreground">{repo.description}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground"/>
                                      {repo.language}
                                  </span>
                                    <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3"/> {repo.stars}
                                  </span>
                                    <span className="flex items-center gap-1">
                                    <GitFork className="h-3 w-3"/> {repo.forks}
                                  </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Skills */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                >
                    <motion.h2 variants={fadeUp} custom={0}
                               className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="font-mono text-primary">&#47;&#47;</span> Stack technique
                    </motion.h2>
                    <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-lg border-2 border-border bg-card px-3 py-1.5 font-mono text-base text-secondary-foreground transition-colors hover:border-primary/30 hover:text-primary"
                            >
                            {skill}
                          </span>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Footer */}
                <div className="mt-12 flex items-center justify-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-primary" />
                    <span className=" text-sm text-muted-foreground font-mono">Propulsé par Code<span className="text-primary">Branch</span></span>
                </div>
            </div>
        </div>
    );
}
