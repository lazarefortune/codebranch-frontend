import {Link, useNavigate} from "react-router-dom";
import {register as apiRegister} from "@/api/auth";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Logo} from "@/components/Logo";
import {useForm} from "react-hook-form";
import {registerSchema, RegisterValues} from "@/validation/registerSchema";
import {zodResolver} from "@hookform/resolvers/zod";

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            const response = await apiRegister(data.username, data.email, data.password);

            localStorage.setItem("token", response.access_token);

            navigate("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue";
            console.error(message);
            setError("email", {
                type: "manual",
                message: "Email déjà utilisé ou invalide.",
            });
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Gauche */}
            <div className="bg-gray-900 text-white hidden lg:flex flex-col justify-between p-10">
                <div/>
                <blockquote className="text-2xl font-light leading-relaxed">
                    “Un développeur qui ne pratique pas est comme un sabre qui rouille.”
                    <br/>
                    <span className="text-sm text-gray-400 mt-2 block">— CodeBranch</span>
                </blockquote>
            </div>

            {/* Droite */}
            <div className="flex items-center justify-center p-6 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <div className="w-full flex justify-center items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Logo/>
                        </Link>
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-gray-600 text-sm">
                            Centralise tous tes liens dev en un seul endroit.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="username">Nom</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                {...register("username")}
                            />
                            {errors.username && (
                                <p className="form-error">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="form-error">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="form-error">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            {isSubmitting ? "Inscription en cours" : "S’inscrire"}
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600">
                        Déjà un compte ?{" "}
                        <Link to="/connexion" className="text-blue-600 hover:underline font-medium">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
