import { ImageResponse } from "next/og";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const ogQuerySchema = z.object({
  type: z.enum(["article", "author", "category", "tag"]),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  metadata: z.string().optional(),
});

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const FONT_URL_REGEX = /src: url\((.+)\) format\('(opentype|truetype)'\)/;

async function loadGoogleFont(font: string, text: string, weight = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(FONT_URL_REGEX);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const params = ogQuerySchema.parse({
      type: searchParams.get("type"),
      title: searchParams.get("title"),
      subtitle: searchParams.get("subtitle") || undefined,
      image: searchParams.get("image") || undefined,
      metadata: searchParams.get("metadata") || undefined,
    });

    const textToLoad = params.title + (params.subtitle || "");

    let fonts: Array<{
      name: string;
      data: ArrayBuffer;
      weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
      style?: "normal" | "italic";
    }> = [];

    try {
      const interRegular = await loadGoogleFont("Inter", textToLoad, 400);
      const interBold = await loadGoogleFont("Inter", textToLoad, 700);

      fonts = [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ];
    } catch {
      fonts = [];
    }

    let content: React.ReactElement;

    switch (params.type) {
      case "article":
        content = <ArticleOG {...params} />;
        break;
      case "author":
        content = <AuthorOG {...params} />;
        break;
      case "category":
        content = <CategoryOG {...params} />;
        break;
      case "tag":
        content = <TagOG {...params} />;
        break;
      default:
        content = <ArticleOG {...params} />;
        break;
    }

    return new ImageResponse(content, {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request parameters",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to generate OG image" },
      { status: 500 }
    );
  }
};

const ArticleOG = ({
  title,
  subtitle,
  image,
  metadata,
}: z.infer<typeof ogQuerySchema>) => {
  const hasImage = image && image !== "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {hasImage ? (
        <>
          <div
            style={{
              width: "600px",
              height: "100%",
              display: "flex",
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#0a0a0a",
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: Required for @vercel/og ImageResponse */}
            {/* biome-ignore lint/correctness/useImageSize: Dimensions handled via container styles */}
            <img
              alt=""
              src={image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)",
              }}
            />
          </div>
          <div
            style={{
              width: "600px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "50px 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "#fafafa",
                  lineHeight: 1.15,
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </div>
              {subtitle && (
                <div
                  style={{
                    fontSize: "20px",
                    color: "#a3a3a3",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
            {metadata && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    color: "#d4d4d4",
                    fontWeight: 500,
                  }}
                >
                  {metadata}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "70px 80px",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.15,
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "24px",
                color: "#a3a3a3",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {subtitle}
            </div>
          )}
          {metadata && (
            <div
              style={{
                fontSize: "20px",
                color: "#d4d4d4",
                fontWeight: 500,
                marginTop: "16px",
              }}
            >
              {metadata}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "20px",
          color: "#737373",
          fontWeight: 500,
        }}
      >
        IndiSight
      </div>
    </div>
  );
};

const AuthorOG = ({
  title,
  subtitle,
  image,
  metadata,
}: z.infer<typeof ogQuerySchema>) => {
  const hasImage = image && image !== "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "60px",
        gap: "40px",
      }}
    >
      {hasImage && (
        <div
          style={{
            display: "flex",
            width: "180px",
            height: "180px",
            borderRadius: "90px",
            overflow: "hidden",
            border: "4px solid #262626",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: Required for @vercel/og ImageResponse */}
          {/* biome-ignore lint/correctness/useImageSize: Dimensions handled via container styles */}
          <img
            alt=""
            src={image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      )}
      {!hasImage && (
        <div
          style={{
            display: "flex",
            width: "180px",
            height: "180px",
            borderRadius: "90px",
            backgroundColor: "#262626",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "72px",
            color: "#737373",
            fontWeight: 700,
            border: "4px solid #404040",
          }}
        >
          {title.charAt(0).toUpperCase()}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          textAlign: "center",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "32px",
              color: "#a3a3a3",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {subtitle}
          </div>
        )}
        {metadata && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1a1a1a",
              border: "2px solid #262626",
              borderRadius: "12px",
              padding: "16px 32px",
              fontSize: "24px",
              color: "#d4d4d4",
              fontWeight: 500,
              marginTop: "10px",
            }}
          >
            {metadata} {Number(metadata) === 1 ? "article" : "articles"}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          fontSize: "20px",
          color: "#737373",
          fontWeight: 500,
        }}
      >
        IndiSight
      </div>
    </div>
  );
};

const CategoryOG = ({
  title,
  subtitle,
  image,
  metadata,
}: z.infer<typeof ogQuerySchema>) => {
  const hasImage = image && image !== "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "80px",
        gap: "30px",
        position: "relative",
      }}
    >
      {hasImage && (
        <>
          {/* biome-ignore lint/performance/noImgElement: Required for @vercel/og ImageResponse */}
          {/* biome-ignore lint/correctness/useImageSize: Dimensions handled via container styles */}
          <img
            alt=""
            src={image}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(26,26,26,0.9) 100%)",
            }}
          />
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          textAlign: "center",
          maxWidth: "1000px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "36px",
              color: "#a3a3a3",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {subtitle}
          </div>
        )}
        {metadata && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1a1a1a",
              border: "2px solid #262626",
              borderRadius: "12px",
              padding: "16px 32px",
              fontSize: "24px",
              color: "#d4d4d4",
              fontWeight: 500,
              marginTop: "10px",
            }}
          >
            {metadata} {Number(metadata) === 1 ? "article" : "articles"}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          fontSize: "20px",
          color: "#737373",
          fontWeight: 500,
          zIndex: 1,
        }}
      >
        IndiSight
      </div>
    </div>
  );
};

const TagOG = ({
  title,
  subtitle,
  metadata,
}: z.infer<typeof ogQuerySchema>) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      padding: "80px",
      gap: "30px",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "400px",
        color: "#1a1a1a",
        fontWeight: 700,
        opacity: 0.3,
      }}
    >
      #
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        textAlign: "center",
        maxWidth: "1000px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontSize: "80px",
          fontWeight: 700,
          color: "#fafafa",
          lineHeight: 1.1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        #{title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: "36px",
            color: "#a3a3a3",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {subtitle}
        </div>
      )}
      {metadata && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a1a",
            border: "2px solid #262626",
            borderRadius: "12px",
            padding: "16px 32px",
            fontSize: "24px",
            color: "#d4d4d4",
            fontWeight: 500,
            marginTop: "10px",
          }}
        >
          {metadata} {Number(metadata) === 1 ? "article" : "articles"}
        </div>
      )}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        display: "flex",
        fontSize: "20px",
        color: "#737373",
        fontWeight: 500,
        zIndex: 1,
      }}
    >
      IndiSight
    </div>
  </div>
);
