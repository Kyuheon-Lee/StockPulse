import { useQuery, type UseQueryResult } from '@tanstack/react-query';

type LiveVideoResponse = {
    items?: {
        id?: {
            videoId?: string;
        };
    }[];
};

type LiveStatusResult = {
    videoId: string | null;
};

type LiveStatusQuery = UseQueryResult<LiveStatusResult, Error>;

type LiveStatusState = {
    videoId: string | null;
    isLive: boolean;
    isLoading: boolean;
    isError: boolean;
    isAvailable: boolean;
};

export const useYouTubeLiveStatus = (channelId: string): LiveStatusState => {
    const query: LiveStatusQuery = useQuery({
        queryKey: ['youtube-live', channelId],
        enabled: Boolean(channelId),
        queryFn: async () => {
            const url = new URL('https://www.googleapis.com/youtube/v3/search');
            url.searchParams.set('part', 'snippet');
            url.searchParams.set('channelId', channelId);
            url.searchParams.set('eventType', 'live');
            url.searchParams.set('type', 'video');
            url.searchParams.set('maxResults', '1');
            url.searchParams.set('key', '');

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch YouTube live status.');
            }
            const data = (await response.json()) as LiveVideoResponse;
            const videoId = data.items?.[0]?.id?.videoId ?? null;
            return { videoId };
        },
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 60,
    });

    const videoId = query.data?.videoId ?? null;

    return {
        videoId,
        isLive: Boolean(videoId),
        isLoading: query.isLoading,
        isError: query.isError,
        isAvailable: Boolean(channelId),
    };
};
