import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RocketIcon, Wand2Icon, ZapIcon } from "lucide-react";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="flex flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-white py-20 px-6 text-center">
                <div className="space-y-6 max-w-2xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Centralise tous tes liens développeur en un seul endroit.
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Avec CodeBranch, partage ton GitHub, ton portfolio, ton blog, et plus encore grâce à un seul lien unique.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <Button asChild size="lg">
                            <Link to="/inscription">Commencer maintenant</Link>
                        </Button>
                        <Button variant="outline" asChild size="lg">
                            <Link to="/connexion">Se connecter</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Wand2Icon className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-blue-600">Simple</h2>
                        <p className="text-gray-600 text-sm">
                            Interface minimaliste, focus sur l'essentiel : ton contenu. Pas de fioritures, que du concret.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <RocketIcon className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-blue-600">Personnalisable</h2>
                        <p className="text-gray-600 text-sm">
                            Crée ta page unique, organise tes liens, choisis ton style. Tout est sous ton contrôle.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <ZapIcon className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-blue-600">Ultra rapide</h2>
                        <p className="text-gray-600 text-sm">
                            Ta page se charge instantanément, aussi bien sur mobile que desktop. Partage ton profil sans limites.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-blue-600 py-16 text-center text-white px-6">
                <h2 className="text-3xl font-bold mb-4 max-w-2xl mx-auto">
                    Crée ton profil en 2 minutes et prends le contrôle de ta présence en ligne 🚀
                </h2>
                <Button variant="secondary" size="lg" asChild>
                    <Link to="/inscription">Créer mon compte</Link>
                </Button>
            </section>
        </div>
    );
};

export default Home;
