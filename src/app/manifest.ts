import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        'name': 'SMusic',
        'short_name': 'SMusic',
        'description': 'SMusic description',
    }
}