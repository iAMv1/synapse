import { SkillTree } from "../../features/skills/SkillTree";

export default function SkillsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                    Skill Tree
                </h1>
                <p className="text-gray-400">Master technologies to unlock the collaborative neural network.</p>
            </div>

            <SkillTree />
        </div>
    );
}
