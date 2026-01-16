"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ErrorMessage } from "@/shared/ui/error-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Loader } from "@/shared/ui/loader";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search } from "lucide-react";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Système de Design CodeBranch</h1>
            <p className="text-muted-foreground">
              Référence complète des composants UI et de leurs variantes
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Boutons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
              <CardDescription>
                Tous les styles de boutons disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="default">
                  Default
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Button variant="primary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Champs de saisie</h2>
          <Card>
            <CardHeader>
              <CardTitle>Types d&apos;input</CardTitle>
              <CardDescription>
                Text, email, password et états
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Texte</Label>
                <Input
                  id="text-input"
                  type="text"
                  placeholder="Saisissez du texte"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-input">Email</Label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="exemple@codebranch.dev"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-input">Mot de passe</Label>
                <Input
                  id="password-input"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disabled-input">Désactivé</Label>
                <Input
                  id="disabled-input"
                  type="text"
                  placeholder="Champ désactivé"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Labels Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Labels</h2>
          <Card>
            <CardHeader>
              <CardTitle>Étiquettes</CardTitle>
              <CardDescription>Pour identifier les champs de formulaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label-example">Label standard</Label>
                <Input id="label-example" type="text" placeholder="Exemple" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label-required" className="after:content-['*'] after:text-destructive after:ml-1">
                  Label requis
                </Label>
                <Input id="label-required" type="text" placeholder="Champ requis" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Error Messages Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Messages d&apos;erreur</h2>
          <Card>
            <CardHeader>
              <CardTitle>Gestion des erreurs</CardTitle>
              <CardDescription>
                Affichage des erreurs de validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="error-input">Champ avec erreur</Label>
                <Input
                  id="error-input"
                  type="text"
                  placeholder="Saisissez quelque chose"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowError(e.target.value.length > 0 && e.target.value.length < 3);
                  }}
                  className={showError ? "border-destructive" : ""}
                />
                {showError && (
                  <ErrorMessage message="Le champ doit contenir au moins 3 caractères" />
                )}
              </div>

              <ErrorMessage message="Message d'erreur standard" />
              <ErrorMessage>
                Message d&apos;erreur avec contenu personnalisé
              </ErrorMessage>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cartes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Carte simple</CardTitle>
                <CardDescription>
                  Description de la carte avec titre et description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contenu de la carte. Les cartes sont utilisées pour regrouper
                  du contenu connexe.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carte avec contenu</CardTitle>
                <CardDescription>
                  Exemple de carte avec différents éléments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input type="text" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="votre@email.com" />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost">Annuler</Button>
                <Button variant="primary">Enregistrer</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Loader Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Chargeurs</h2>
          <Card>
            <CardHeader>
              <CardTitle>États de chargement</CardTitle>
              <CardDescription>
                Indicateurs de chargement en différentes tailles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <Loader size="sm" />
                  <span className="text-xs text-muted-foreground">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loader size="default" />
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loader size="lg" />
                  <span className="text-xs text-muted-foreground">Large</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Étiquettes</CardTitle>
              <CardDescription>
                Badges pour afficher des statuts, catégories ou labels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Nouveau</Badge>
                <Badge variant="secondary">En attente</Badge>
                <Badge variant="destructive">Urgent</Badge>
                <Badge variant="outline">Brouillon</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Select Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Sélecteurs</h2>
          <Card>
            <CardHeader>
              <CardTitle>Listes déroulantes</CardTitle>
              <CardDescription>
                Composants Select pour choisir parmi plusieurs options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-example">Sélection simple</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger id="select-example" className="w-[180px]">
                    <SelectValue placeholder="Choisir une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                    <SelectItem value="option4">Option 4</SelectItem>
                  </SelectContent>
                </Select>
                {selectValue && (
                  <p className="text-sm text-muted-foreground">
                    Valeur sélectionnée : {selectValue}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-disabled">Sélection désactivée</Label>
                <Select disabled>
                  <SelectTrigger id="select-disabled" className="w-[180px]">
                    <SelectValue placeholder="Désactivé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dialog/Modal Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Modales</h2>
          <Card>
            <CardHeader>
              <CardTitle>Dialogues</CardTitle>
              <CardDescription>
                Modales pour afficher des informations ou des formulaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="primary">Ouvrir une modale</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Exemple de modale</DialogTitle>
                      <DialogDescription>
                        Ceci est un exemple de modale. Vous pouvez y placer
                        n&apos;importe quel contenu.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="modal-input">Nom</Label>
                        <Input
                          id="modal-input"
                          type="text"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modal-email">Email</Label>
                        <Input
                          id="modal-email"
                          type="email"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setDialogOpen(false)}
                      >
                        Confirmer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Modale de confirmation</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer l&apos;action</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir effectuer cette action ? Cette
                        opération ne peut pas être annulée.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button variant="ghost">Annuler</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Confirmer</Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Typographie</h2>
          <Card>
            <CardHeader>
              <CardTitle>Hiérarchie typographique</CardTitle>
              <CardDescription>
                Tailles, poids et styles de texte disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille XS</p>
                <p className="text-xs">Texte extra-petit pour les labels et annotations</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille SM</p>
                <p className="text-sm">Texte petit pour les descriptions et métadonnées</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille Base</p>
                <p className="text-base">Texte de base pour le contenu principal</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille LG</p>
                <p className="text-lg">Texte large pour les sous-titres</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille XL</p>
                <p className="text-xl">Texte extra-large pour les titres de section</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille 2XL</p>
                <p className="text-2xl font-semibold">Titre de section principal</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille 3XL</p>
                <p className="text-3xl font-bold">Titre de page</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Taille 4XL</p>
                <p className="text-4xl font-bold">Titre principal</p>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Poids de police</h3>
                <div className="space-y-2">
                  <p className="font-light">Light (300) - Texte léger</p>
                  <p className="font-normal">Normal (400) - Texte normal</p>
                  <p className="font-medium">Medium (500) - Texte moyen</p>
                  <p className="font-semibold">Semibold (600) - Texte semi-gras</p>
                  <p className="font-bold">Bold (700) - Texte gras</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Styles</h3>
                <div className="space-y-2">
                  <p className="italic">Texte en italique</p>
                  <p className="underline">Texte souligné</p>
                  <p className="line-through">Texte barré</p>
                  <p className="uppercase">Texte en majuscules</p>
                  <p className="lowercase">TEXTE EN MINUSCULES</p>
                  <p className="capitalize">texte avec première lettre en majuscule</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacing Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Espacements</h2>
          <Card>
            <CardHeader>
              <CardTitle>Échelle d&apos;espacement</CardTitle>
              <CardDescription>
                Système d&apos;espacement cohérent basé sur une échelle de 4px
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">0.5 (2px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "2px" }}></div>
                  <code className="text-xs">p-0.5 / gap-0.5</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">1 (4px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "4px" }}></div>
                  <code className="text-xs">p-1 / gap-1</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">2 (8px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "8px" }}></div>
                  <code className="text-xs">p-2 / gap-2</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">3 (12px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "12px" }}></div>
                  <code className="text-xs">p-3 / gap-3</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">4 (16px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "16px" }}></div>
                  <code className="text-xs">p-4 / gap-4</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">6 (24px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "24px" }}></div>
                  <code className="text-xs">p-6 / gap-6</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">8 (32px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "32px" }}></div>
                  <code className="text-xs">p-8 / gap-8</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">12 (48px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "48px" }}></div>
                  <code className="text-xs">p-12 / gap-12</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">16 (64px)</div>
                  <div className="h-4 bg-primary rounded" style={{ width: "64px" }}></div>
                  <code className="text-xs">p-16 / gap-16</code>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Exemples d&apos;utilisation</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm">Padding 4 (16px) - Pour les cartes et conteneurs</p>
                  </div>
                  <div className="p-6 bg-muted rounded-md">
                    <p className="text-sm">Padding 6 (24px) - Pour les headers de cartes</p>
                  </div>
                  <div className="p-8 bg-muted rounded-md">
                    <p className="text-sm">Padding 8 (32px) - Pour les sections principales</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Design Tokens Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tokens de design</h2>
          <Card>
            <CardHeader>
              <CardTitle>Couleurs</CardTitle>
              <CardDescription>
                Palette de couleurs du système de design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-primary"></div>
                  <div className="text-sm">
                    <p className="font-medium">Primary</p>
                    <p className="text-muted-foreground">#4255FF</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-secondary"></div>
                  <div className="text-sm">
                    <p className="font-medium">Secondary</p>
                    <p className="text-muted-foreground">Gris clair</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-destructive"></div>
                  <div className="text-sm">
                    <p className="font-medium">Destructive</p>
                    <p className="text-muted-foreground">Rouge</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-muted"></div>
                  <div className="text-sm">
                    <p className="font-medium">Muted</p>
                    <p className="text-muted-foreground">Gris neutre</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-accent border"></div>
                  <div className="text-sm">
                    <p className="font-medium">Accent</p>
                    <p className="text-muted-foreground">Survol</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md bg-card border"></div>
                  <div className="text-sm">
                    <p className="font-medium">Card</p>
                    <p className="text-muted-foreground">Fond de carte</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
