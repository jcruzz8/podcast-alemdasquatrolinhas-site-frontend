import React from 'react';

// 'React.memo' é o "escudo". Ele impede o "redesenho"
// se a 'prop' (iframe) for a mesma.
const SpotifyEmbed = React.memo(function SpotifyEmbed({ iframe }) {

    if (!iframe) {
        return null;
    }

    return (
        <div
            dangerouslySetInnerHTML={{ __html: iframe }}
            className="spotify-embed-container"
        />
    );
});

export default SpotifyEmbed;