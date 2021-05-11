import pygame

pygame.init()

screen_width = 640
screen_height = 480
min_screen_width = 200
width = 94
height = 50
margin = 50
ratio = 94 / 50
scale = int(screen_width / width)
line_width = 3
screen = pygame.display.set_mode((screen_width, screen_height), pygame.RESIZABLE)

pygame.display.set_caption("Basketball Simulator")
icon = pygame.image.load("basketball_icon.png")
pygame.display.set_icon(icon)

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def resize(size):
    global screen_width, screen_height, width, height, scale, line_width
    screen_width = size[0]
    if screen_width < min_screen_width:
        screen_width = min_screen_width
    screen_height = int(screen_width / ratio)
    width = screen_width - margin
    height = int(width / ratio)
    scale = int(width / 94)
    if scale < 4:
        line_width = 1
    elif scale < 10:
        line_width = 2
    else:
        line_width = 3
    screen = pygame.display.set_mode((screen_width, screen_height), pygame.RESIZABLE)


def draw_sideline():
    x = int((screen_width - width) / 2)
    y = int((screen_height - height) / 2)
    pygame.draw.rect(
        screen, WHITE, [x, y, width, height], line_width,
    )


def draw_centercircle():
    center = (int(screen_width / 2), int(screen_height / 2))
    pygame.draw.circle(screen, WHITE, center, 6 * scale, line_width)
    pygame.draw.circle(screen, WHITE, center, 2 * scale, line_width)


def draw_hoop():
    p1 = (
        int(((screen_width - width) / 2) + 5.25 * scale),
        int(screen_height / 2),
    )
    p2 = (
        int(((screen_width + width) / 2) - 5.25 * scale),
        int(screen_height / 2),
    )
    radius = int(1.5 * scale)
    pygame.draw.circle(screen, WHITE, p1, radius, line_width)
    pygame.draw.circle(screen, WHITE, p2, radius, line_width)


def draw_backboard():
    start1 = (
        ((screen_width - width) / 2) + 3.5 * scale,
        (screen_height / 2) + 3 * scale,
    )
    end1 = (((screen_width - width) / 2) + 3.5 * scale, (screen_height / 2) - 3 * scale)
    start2 = (
        ((width + screen_width) / 2) - 3.5 * scale,
        (screen_height / 2) + 3 * scale,
    )
    end2 = (((width + screen_width) / 2) - 3.5 * scale, (screen_height / 2) - 3 * scale)
    pygame.draw.line(screen, WHITE, start1, end1, line_width)
    pygame.draw.line(screen, WHITE, start2, end2, line_width)


def draw_halfline():
    p1 = (int(screen_width / 2), int((screen_height - height) / 2))
    p2 = (int(screen_width / 2), int((height + screen_height) / 2))
    pygame.draw.line(screen, WHITE, p1, p2, line_width)


def draw_threepointline():
    pass


def draw_freethrowline():
    pass


def draw_freethrowcircle():
    pass


def draw_key():
    pass


def drawCourt():
    draw_sideline()
    draw_centercircle()
    draw_halfline()
    draw_hoop()
    draw_backboard()
    draw_threepointline()
    draw_freethrowline()
    draw_freethrowcircle()
    draw_key()


def main():
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()

            elif event.type == pygame.VIDEORESIZE:
                resize(event.size)
                screen.fill(BLACK)
                drawCourt()
                pygame.display.update()

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    pass

        screen.fill(BLACK)
        drawCourt()
        pygame.display.update()


if __name__ == "__main__":
    main()
