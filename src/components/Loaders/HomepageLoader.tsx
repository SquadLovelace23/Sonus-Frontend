import React from 'react';
import ContentLoader from "react-content-loader"
import { IContentLoaderProps } from "react-content-loader"

const HomepageLoader = (props: IContentLoaderProps) => (
    <ContentLoader

        speed={2}
        width={2000}
        height={900}
        viewBox="-200 -50 1000 600"
        backgroundColor="#161618"
        foregroundColor="#383838"
        {...props}
    >
        <rect x="16" y="20" rx="5" ry="5" width="82" height="20" />

        <rect x="16" y="58" rx="10" ry="10" width="120" height="85" />
        <rect x="156" y="58" rx="10" ry="10" width="120" height="85" />
        <rect x="296" y="58" rx="10" ry="10" width="120" height="85" />
        <rect x="436" y="58" rx="10" ry="10" width="120" height="85" />
        <rect x="576" y="58" rx="10" ry="10" width="120" height="85" />
        <rect x="716" y="58" rx="10" ry="10" width="120" height="85" />

        <rect x="16" y="165" rx="5" ry="5" width="180" height="20" />

        <rect x="16" y="210" rx="10" ry="10" width="180" height="77" />
        <rect x="216" y="210" rx="10" ry="10" width="180" height="77" />
        <rect x="416" y="210" rx="10" ry="10" width="180" height="77" />
        <rect x="616" y="210" rx="10" ry="10" width="180" height="77" />
        <rect x="816" y="210" rx="10" ry="10" width="180" height="77" />

        <rect x="18" y="300" rx="5" ry="5" width="82" height="20" />

        <circle cx="80" cy="410" r="65" />
        <circle cx="250" cy="410" r="65" />
        <circle cx="420" cy="410" r="65" />
        <circle cx="590" cy="410" r="65" />
        <circle cx="740" cy="410" r="65" />
        <circle cx="910" cy="410" r="65" />

        <rect x="20" y="500" rx="5" ry="5" width="82" height="20" />

        <rect x="216" y="540" rx="10" ry="10" width="120" height="90" />
        <rect x="16" y="540" rx="10" ry="10" width="120" height="90" />
        <rect x="416" y="540" rx="10" ry="10" width="120" height="90" />
        <rect x="616" y="540" rx="10" ry="10" width="120" height="90" />
        <rect x="816" y="540" rx="10" ry="10" width="120" height="90" />
    </ContentLoader>
)

export default HomepageLoader