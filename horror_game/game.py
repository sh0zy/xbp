import pygame
import random
import sys

pygame.init()

# 画面設定
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Simple Horror Game")

clock = pygame.time.Clock()

# プレイヤー設定
player_size = 40
player_x = WIDTH // 2
player_y = HEIGHT // 2
player_speed = 5

# 幽霊画像
ghost_img = pygame.image.load("ghost.png")
ghost_img = pygame.transform.scale(ghost_img, (80, 80))

# 効果音
scream = pygame.mixer.Sound("scream.wav")

# 幽霊の初期状態
ghost_x = random.randint(0, WIDTH - 80)
ghost_y = random.randint(0, HEIGHT - 80)
ghost_visible = False
ghost_timer = 0

# ゲームオーバー
def game_over():
    font = pygame.font.SysFont(None, 80)
    text = font.render("GAME OVER", True, (255, 0, 0))
    screen.blit(text, (WIDTH//2 - 200, HEIGHT//2 - 40))
    pygame.display.update()
    pygame.time.wait(2000)
    pygame.quit()
    sys.exit()

# メインループ
while True:
    screen.fill((10, 10, 10))  # 暗い背景

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # プレイヤー操作
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        player_y -= player_speed
    if keys[pygame.K_DOWN]:
        player_y += player_speed
    if keys[pygame.K_LEFT]:
        player_x -= player_speed
    if keys[pygame.K_RIGHT]:
        player_x += player_speed

    # ランダムで幽霊出現
    if not ghost_visible and random.random() < 0.005:
        ghost_visible = True
        ghost_x = random.randint(0, WIDTH - 80)
        ghost_y = random.randint(0, HEIGHT - 80)
        scream.play()
        ghost_timer = 60  # 1秒くらい表示

    # 幽霊表示
    if ghost_visible:
        screen.fill((80, 0, 0))  # 赤いフラッシュ演出
        screen.blit(ghost_img, (ghost_x, ghost_y))
        ghost_timer -= 1
        if ghost_timer <= 0:
            ghost_visible = False

    # プレイヤー描画
    pygame.draw.rect(screen, (200, 200, 200), (player_x, player_y, player_size, player_size))

    # 当たり判定
    if ghost_visible:
        player_rect = pygame.Rect(player_x, player_y, player_size, player_size)
        ghost_rect = pygame.Rect(ghost_x, ghost_y, 80, 80)
        if player_rect.colliderect(ghost_rect):
            game_over()

    pygame.display.update()
    clock.tick(60)