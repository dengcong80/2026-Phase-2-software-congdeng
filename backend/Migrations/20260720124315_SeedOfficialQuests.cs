using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedOfficialQuests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Quests",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Description", "Latitude", "Longitude", "RewardXp", "Status", "Title" },
                values: new object[,]
                {
                    { new Guid("da000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Climb to the summit of Mt Eden and enjoy the panoramic views.", -36.875999999999998, 174.76439999999999, 120, 0, "Mt Eden Summit" },
                    { new Guid("da000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Have a relaxing picnic at Cornwall Park.", -36.900500000000001, 174.78299999999999, 70, 0, "Cornwall Park Picnic" },
                    { new Guid("da000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit One Tree Hill and learn about its history.", -36.9026, 174.785, 100, 0, "One Tree Hill Explorer" },
                    { new Guid("da000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Explore the beautiful Auckland Domain gardens.", -36.860599999999998, 174.77619999999999, 80, 0, "Auckland Domain Adventure" },
                    { new Guid("da000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Spot native birds at Western Springs Park.", -36.866999999999997, 174.71850000000001, 100, 0, "Western Springs Wildlife" },
                    { new Guid("db000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit the iconic Old Arts Building at University of Auckland.", -36.8523, 174.76910000000001, 60, 0, "Old Arts Building - UoA" },
                    { new Guid("db000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Check in at the General Library, UoA.", -36.851999999999997, 174.768, 70, 0, "General Library - UoA" },
                    { new Guid("db000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Find the famous Clock Tower at University of Auckland.", -36.852499999999999, 174.76849999999999, 80, 0, "Clock Tower - UoA" },
                    { new Guid("db000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Explore AUT City Campus and check in.", -36.851500000000001, 174.7595, 60, 0, "AUT City Campus" },
                    { new Guid("db000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit Massey University Albany Campus.", -36.729500000000002, 174.702, 100, 0, "Massey Albany Explorer" },
                    { new Guid("dc000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit the Auckland War Memorial Museum and explore NZ history.", -36.860599999999998, 174.77780000000001, 120, 0, "Auckland War Memorial Museum" },
                    { new Guid("dc000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Explore contemporary and traditional art at Auckland Art Gallery.", -36.8506, 174.7655, 80, 0, "Auckland Art Gallery" },
                    { new Guid("dc000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Take a walk through historic Albert Park.", -36.851500000000001, 174.7671, 70, 0, "Albert Park History Walk" },
                    { new Guid("dc000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Discover the heritage buildings along High Street.", -36.847499999999997, 174.76499999999999, 90, 0, "High Street Heritage Hunt" },
                    { new Guid("dc000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Learn and use a traditional Māori greeting. Type \"Kia ora\" to complete!", -36.848500000000001, 174.76329999999999, 60, 0, "Learn a Māori Greeting" },
                    { new Guid("dd000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Share your go-to study spot with the community.", -36.848500000000001, 174.76329999999999, 80, 0, "Recommend Your Favourite Study Spot" },
                    { new Guid("dd000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Discover and photograph hidden street art in Auckland.", -36.848999999999997, 174.762, 100, 0, "Hidden Street Art" },
                    { new Guid("dd000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Capture the most beautiful Auckland sunset.", -36.848500000000001, 174.76329999999999, 120, 0, "Sunset Photo Challenge" },
                    { new Guid("dd000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Share your favourite weekend walking route.", -36.848500000000001, 174.76329999999999, 90, 0, "Favourite Weekend Walk" },
                    { new Guid("dd000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Share a local secret spot that tourists don't know about.", -36.848500000000001, 174.76329999999999, 150, 0, "Local Secret Challenge" },
                    { new Guid("de000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit Mission Bay and upload a photo of the beach.", -36.8523, 174.8313, 80, 0, "Mission Bay Explorer" },
                    { new Guid("de000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Walk along Viaduct Harbour and check in.", -36.843499999999999, 174.76150000000001, 70, 0, "Auckland Waterfront Walk" },
                    { new Guid("de000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Find the Britomart Clock Tower and take a photo.", -36.844099999999997, 174.76769999999999, 60, 0, "Britomart Discovery" },
                    { new Guid("de000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit the public art installations in Wynyard Quarter.", -36.839500000000001, 174.75749999999999, 90, 0, "Wynyard Quarter Explorer" },
                    { new Guid("de000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Share your favourite Auckland skyline photo after sunset.", -36.840600000000002, 174.74000000000001, 120, 0, "Auckland Night Lights" },
                    { new Guid("df000000-0000-0000-0000-000000000001"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Find and visit a hidden café in Auckland CBD.", -36.846499999999999, 174.7645, 80, 0, "Hidden Café Hunt" },
                    { new Guid("df000000-0000-0000-0000-000000000002"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Try the best flat white in Auckland and share your review.", -36.844499999999996, 174.76349999999999, 90, 0, "Best Flat White Challenge" },
                    { new Guid("df000000-0000-0000-0000-000000000003"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Visit a night market and try international street food.", -36.869999999999997, 174.785, 110, 0, "Auckland Night Market" },
                    { new Guid("df000000-0000-0000-0000-000000000004"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Enjoy classic Kiwi fish and chips with an ocean view.", -36.8523, 174.8313, 70, 0, "Eat Fish & Chips by the Sea" },
                    { new Guid("df000000-0000-0000-0000-000000000005"), new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "Try an authentic New Zealand meat pie.", -36.847999999999999, 174.76249999999999, 60, 0, "Try a Kiwi Pie" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("da000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("da000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("da000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("da000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("da000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("db000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("db000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("db000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("db000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("db000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dc000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dc000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dc000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dc000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dc000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dd000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dd000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dd000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dd000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("dd000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("de000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("de000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("de000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("de000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("de000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("df000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("df000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("df000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("df000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Quests",
                keyColumn: "Id",
                keyValue: new Guid("df000000-0000-0000-0000-000000000005"));
        }
    }
}
