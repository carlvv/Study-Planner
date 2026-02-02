import { useQuery } from "@tanstack/react-query";
import { LoginLayout } from "../../components/layout/Login_Layout";
import { fetch_backend_auth } from "../../utils/helper";
import Layout from "../../components/layout/Layout";
import { H1 } from "../../components/Text";
interface Data { name: string, id: string, programm: string, isbachelor: boolean, version: string, }
export const Profile = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["profile-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/profile");
            return res.json() as unknown as Data;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-500">
                Loading…
            </div>
        );
    }

    return (
        <Layout backURL="/">
            <H1 className="pt-6">Profil</H1>
            <div className="m-auto mt-8  w-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                    Persönliche Daten
                </h2>

                <div className="space-y-4 text-gray-700">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{data?.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Matrikelnummer</p>
                        <p className="font-medium">{data?.id}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Studiengang</p>
                        <p className="font-medium">
                            {data?.isbachelor ? "Bachelor" : "Master"} {data?.programm}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Studiengang ID</p>
                        <p className="font-mono text-sm">{data?.version}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
